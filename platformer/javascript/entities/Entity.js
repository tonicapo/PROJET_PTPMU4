function Entity(level, position, width, height){
    MapObject.call(this, level, position.x * platformer.tileSizeX + platformer.tileSizeX - width, position.y * platformer.tileSizeY  + platformer.tileSizeY - height, width, height);

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

    this.animations.idle = new Animation('idle', platformer.textures.player.idle, 1000, { random : true });
    this.animations.walking = new Animation('walking', platformer.textures.player.walking, 100);
    this.animations.jumping = new Animation('jumping', platformer.textures.player.jumping, 0);
    this.animations.doubleJumping = new Animation('doubleJumping', platformer.textures.player.doubleJumping, 150, { loop : true, cancelable : false });
    this.animations.falling = new Animation('falling', platformer.textures.player.falling, 1000);

    this.animations.deadIdle = new Animation('deadIdle', platformer.textures.player.deadIdle, 100, { loop : false, cancelable : false });
    this.animations.deadFalling = new Animation('deadFalling', platformer.textures.player.deadFalling, 0, { loop : false, cancelable : true });

    this.animations.bowAttack = new Animation('bowAttack', platformer.textures.player.bowAttack, 150, { cancelable : false });
    this.animations.knifeAttack = new Animation('knifeAttack', platformer.textures.player.knifeAttack, 150, { cancelable : false });
    this.animations.swordAttack = new Animation('swordAttack', platformer.textures.player.swordAttack, 100, { cancelable : false });
    this.animations.fireBallAttack = new Animation('fireBallAttack', platformer.textures.player.knifeAttack, 150, { cancelable : false });

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

                this.setDamage(this, 1000, 0, 2, 2);
            }
        }
    }


    /**
    * Blood effects
    */

    this.bloodSplash = function(dir, multiplier){
        var amount = randomInt(this.minBloodAmount() * multiplier, this.maxBloodAmount() * multiplier);

        for(var i = 0; i < amount; i++){
            level.spawnParticle(new Blood(level, this.getCenter(), dir));
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
                else if(selectedWeapon.getName() == 'fireBallSpell'){
                    this.setAnimation(this.animations.fireBallAttack);
                }

                this.setAttacking(false);
            }
            else if(this.isJumping()){
                if(this.isDoubleJumping()){
                    this.setAnimation(this.animations.doubleJumping);
                    this.setDoubleJumping(false);
                }
                else{
                    this.setAnimation(this.animations.jumping);
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
            if(this.isBlockedDown()){
                this.setAnimation(this.animations.deadIdle);
            }
            else{
                this.setAnimation(this.animations.deadFalling);
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
                        this.hit(targets[i], weapon, 0, this.getDirection());
                    }
                }

                // on boucle dans la liste des tiles visibles pour savoir si on a touché un tile cassable
                var tiles = level.getMap().getVisibleTiles();

                for(var i = 0, n = tiles.length; i < n; i++){
                    if(tiles[i].isBreakable()){
                        if(self.getRangeBox().intersects(tiles[i])){
                            tiles[i].break();
                        }
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
                else if(weaponName == 'fireBallSpell'){
                    animDelay = this.animations.fireBallAttack.getSpeed();
                }

                level.getTimers().addTimer(function(){
                    var offset = (self.getDirection() == 1) ? self.width : 0;
                    // le projectile part au niveau de la taille du personnage et devant lui dans la même direction
                    var position = new Position(self.x + offset, self.y + self.height / 2);

                    if(weaponName == 'bow'){
                        level.spawnItem(new Arrow(level, self, targets, position, self.getDirection()));
                    }
                    else if(weaponName == 'knife'){
                        level.spawnItem(new Knife(level, self, targets, position, self.getDirection()));
                    }
                    else if(weaponName == 'fireBallSpell'){
                        level.spawnItem(new FireBall(level, self, targets, position, self.getDirection()));
                    }
                }, animDelay);
            }

            level.getTimers().addTimer(function(){
                canAttack = true;
            }, weapon.property.delay);
        }
    }

    this.hit = function(target, weapon, distance, originDirection){
        if(typeof distance === 'undefined'){
            distance = 0;
        }
        var bloodMultiplier = 1,
            modifier = 1,
            amount = 0,
            knockback = 0;

        if(weapon.constructor.name == 'Weapon'){
            if(distance > weapon.property.range){
                modifier = toFloat(distance / weapon.property.range);
            }

            knockback = toFloat(weapon.property.knockback / modifier);
            amount = toFloat(weapon.property.damage / modifier);
            bloodMultiplier = Math.round(weapon.property.bleeding / modifier);
        }

        this.setDamage(target, amount, knockback, bloodMultiplier, originDirection);
    }

    this.setDamage = function(entity, amount, knockback, bloodMultiplier, originDirection){
        if(knockback > 0){
            entity.setVector((originDirection == 1) ? knockback : -knockback, -knockback);
        }
        entity.setHealth(entity.getHealth() - amount);
        entity.bloodSplash(originDirection, bloodMultiplier);

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
                self.setDamage(entity, damageAmount * 0.25, 0, 1, 2);
            }
        }, 1000);
    }

    this.minBloodAmount = function(){
        return parseInt(1 + ((this.width * this.height) / (platformer.tileSizeX * platformer.tileSizeY)) * 1, 10);
    }
    this.maxBloodAmount = function(){
        return parseInt(1 + ((this.width * this.height) / (platformer.tileSizeX * platformer.tileSizeY)) * 6, 10);
    }


    this.setDead = function(){
        dead = true;
        vx = 0;
        vy = 0;
        this.left = false;
        this.right = false;
        this.setColor('#a6374b');
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
