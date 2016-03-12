function Entity(level, position, width, height, renderWidth, renderHeight){
    MapObject.call(this, level, position.x * platformer.tileSizeX + platformer.tileSizeX - width, position.y * platformer.tileSizeY  + platformer.tileSizeY - height, width, height, renderWidth, renderHeight);

    var self = this;
    var health;
    var dead = false;
    var bleeding = false;

    var inventory = [];
    var selectedItemId = 0;

    var canAttack = true;
    var attacking = false;

    this.property.maxHealth = 0;
    this.property.baseRange = 0;

    this.property.bleedingChance = 0;

    this.animations = {
        idle : new Animation('test', platformer.textures.entity, 1000),
        walking : new Animation('test', platformer.textures.entity, 1000),
        jumping : new Animation('test', platformer.textures.entity, 1000),
        doubleJumping : new Animation('test', platformer.textures.entity, 1000),
        falling : new Animation('test', platformer.textures.entity, 1000),
        deadIdle : new Animation('test', platformer.textures.entity, 1000),
        deadFalling : new Animation('test', platformer.textures.entity, 1000),

        bowAttack : new Animation('bowAttack', platformer.textures.entity, 150, { cancelable : false }),
        knifeAttack : new Animation('knifeAttack', platformer.textures.entity, 150, { cancelable : false }),
        swordAttack : new Animation('swordAttack', platformer.textures.entity, 150, { cancelable : false })
    };

    this.update = function(){
        this.updateMovement();
        this.updateInteraction();
        this.updateAnimation();
    }

    /**
    * Permet d'intéragir avec le tile dans lequel l'entité se trouve
    */
    this.updateInteraction = function(){
        var currentTile = this.getTileAt(this.x + this.width / 2, this.y + this.height / 2);

        if(typeof currentTile !== 'undefined'){
            if(currentTile.equals(platformer.tiletype.spike) && !this.isDead()){
                this.property.fallSpeed = 0.1;
                this.property.maxFallSpeed = 0.25;

                this.setDamage(this, 1000, 4, 2);
            }
        }
    }


    /**
    * Blood effects
    */

    this.bloodSplash = function(dir, min, max){
        var amount = randomInt(min, max);

        for(var i = 0; i < amount; i++){
            level.spawnParticle(new Blood(level, self.getCenter(), dir));
        }
    }



    this.animate = function(){
        if(!this.isDead()){
            if(this.isAttacking()){
                var selectedWeapon = this.getSelectedItem();

                if(selectedWeapon.getName() == 'bow'){
                    this.setAnimation(this.animations.bowAttack);
                }
                else if(selectedWeapon.getName() == 'knife'){
                    this.setAnimation(this.animations.knifeAttack);
                }
                else if(selectedWeapon.getName() == 'sword'){
                    this.setAnimation(this.animations.swordAttack);
                }

                this.setAttacking(false);
            }
            else if(this.isJumping()){
                this.setAnimation(this.animations.jumping);

                if(this.isDoubleJumping()){
                    this.setAnimation(this.animations.doubleJumping);
                }
            }
            else if(this.isFalling()){
                this.setAnimation(this.animations.falling);
            }
            else if(this.left || this.right){
                this.setAnimation(this.animations.walking);
            }
            else{
                this.setAnimation(this.animations.idle);
            }
        }
        else{
            if(this.isFalling()){
                this.setAnimation(this.animations.deadFalling);
            }
            else{
                this.setAnimation(this.animations.deadIdle);
            }
        }
    }

    this.setHealth = function(h){
        health = parseInt(h, 10);

        if(health < 0){
            health = 0;
        }
        if(health > this.property.maxHealth){
            health = this.property.maxHealth;
        }

        if(health == 0){
            this.setDead();
        }
    }

    this.attack = function(targets){
        if(!canAttack || dead){
            return;
        }

        var weapon = this.getSelectedItem();
        var rangeBox = this.getRangeBox();

        if(weapon.constructor.name == 'Weapon'){
            canAttack = false;
            attacking = true;


            if(!weapon.property.projectile){
                for(var i in targets){
                    if(rangeBox.intersects(targets[i]) && !targets[i].isDead() && targets[i] !== this){
                        this.hit(targets[i], weapon, this.getDirection());
                    }
                }
            }
            else{
                var animDelay = 0;
                var weaponName = weapon.getName();

                // on récupère le délai que l'animation va prendre pour envoyer le projectile une fois l'animation finie
                if(weaponName == 'bow'){
                    animDelay = this.animations.bowAttack.getSpeed();
                }
                else if(weaponName == 'knife'){
                    animDelay = this.animations.knifeAttack.getSpeed();
                }

                level.getTimers().addTimer(function(){
                    var offset = (self.getDirection() == 1) ? self.width : 0;
                    // le projectile part au niveau de la taille du personnage et devant lui dans la même direction
                    var position = new Position(self.x + offset, self.y + self.height / 2);

                    if(weaponName == 'bow'){
                        level.spawnItem(new Arrow(level, self, targets, weapon, position, self.getDirection()));
                    }
                    else if(weaponName == 'knife'){
                        level.spawnItem(new Knife(level, self, targets, weapon, position, self.getDirection()));
                    }
                }, animDelay);
            }

            level.getTimers().addTimer(function(){
                canAttack = true;
            }, weapon.property.delay);
        }
    }

    this.hit = function(target, weapon, originDirection){
        var amount = weapon.property.damage;
        // TODO : prendre en compte la distance / ajouter un effet de knockback
        this.setDamage(target, amount, weapon.property.bleeding, originDirection);
    }

    this.setDamage = function(entity, amount, bloodMultiplier, originDirection){
        if(typeof bloodMultiplier === 'undefined'){
            bloodMultiplier = 1;
        }
        if(bloodMultiplier < 0){
            bloodMultiplier = 0;
        }

        entity.setHealth(entity.getHealth() - amount);
        entity.bloodSplash(originDirection, entity.minBloodAmount() * bloodMultiplier, entity.maxBloodAmount() * bloodMultiplier);

        if(!entity.isDead()){
            var rand = Math.random();
            if(rand > 1 - entity.property.bleedingChance){
                entity.setBleeding(true);
                bleed(entity, amount);
            }
        }
    }

    /**
    * Fixe un timer qui va enlever 25% des dégâts qui ont causé la blessure chaque seconde avec un effet de goutte de sang
    */
    function bleed(entity, damageAmount){
        // on stoppe la perte de vie quand on descend sous la barre des 25% de vie
        var minHealthValue = entity.property.maxHealth * 0.25;

        if(entity.getHealth() <= minHealthValue && entity.isBleeding()){
            entity.setHealth(minHealthValue);
            entity.setBleeding(false);

            return;
        }

        // on programme un nouveau bleed
        level.getTimers().addTimer(function(){
            if(bleeding){
                bloodSplash(2, 0, 3);
                self.setDamage(entity, damageAmount * 0.25, 2);
            }
        }, 1000);
    }

    this.minBloodAmount = function(){
        return parseInt(1 + ((this.width * this.height) / (platformer.tileSizeX * platformer.tileSizeY)) * 2, 10);
    }
    this.maxBloodAmount = function(){
        return parseInt(1 + ((this.width * this.height) / (platformer.tileSizeX * platformer.tileSizeY)) * 10, 10);
    }


    this.setDead = function(){
        dead = true;
        vx = 0;
        vy = 0;
        this.left = false;
        this.right = false;
    }

    this.setBleeding = function(b){
        bleeding = b;
    }

    this.setAttacking = function(b){
        attacking = b;
    }


    /**
    * Inventory
    */

    this.addInventory = function(item){
        inventory.push(item);
    }

    /**
    * Retourne l'item sélectionné
    */
    this.getSelectedItem = function(){
        return inventory[selectedItemId];
    }

    this.setSelectedItem = function(id){
        selectedItemId = id;

        if(selectedItemId < 0){
            selectedItemId = 0;
        }
        if(selectedItemId > inventory.length - 1){
            selectedItemId = inventory.length - 1;
        }
    }


    /**
    * Retourne un rectangle représentant la portée de l'entité
    */
    this.getRangeBox = function(){
        var rangeWidth = 0;
        var rangeHeight = 0;
        var selected = this.getSelectedItem();
        var offset = 0;

        if(typeof selected !== 'undefined'){
            rangeWidth = selected.property.range + this.property.baseRange;
            rangeHeight = this.height;
        }

        offset = (this.getDirection() == 1) ? this.width : -rangeWidth;

        return new Rectangle(this.x + offset, this.y, rangeWidth, rangeHeight);
    }

    this.renderBox = function(box, ctx, panX, panY){
        ctx.strokeStyle = '#a974bd';
        ctx.strokeRect(box.x - panX, box.y - panY, box.width, box.height);
    }

    this.getInventory = function(){ return inventory; }
    this.isDead = function(){ return dead; }
    this.getHealth = function(){ return health; }
    this.isBleeding = function(){ return bleeding; }
    this.isAttacking = function(){ return attacking; }
}
