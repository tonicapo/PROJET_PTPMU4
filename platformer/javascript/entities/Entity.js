function Entity(level, position, width, height){
    MapObject.call(this, level, position.x + platformer.tileSizeX - width, position.y  + platformer.tileSizeY - height, width, height, true);

    var self = this;
    var health;
    var dead = false;
    var bleeding = false;

    var inventory = [];
    var selectedItemId = 0;

    var canAttack = true;
    var attacking = false;

    var dropCoin = false;

    this.property.maxHealth = 0;
    this.property.baseRange = 0;

    this.property.bleedingChance = 0;

    this.animationList.idle = new Animation('idle', platformer.textures.player.idle, 1000, { random : true });
    this.animationList.walking = new Animation('walking', platformer.textures.player.walking, 100);
    this.animationList.jumping = new Animation('jumping', platformer.textures.player.jumping, 0);
    this.animationList.doubleJumping = new Animation('doubleJumping', platformer.textures.player.doubleJumping, 150, { loop : true, cancelable : false });
    this.animationList.falling = new Animation('falling', platformer.textures.player.falling, 1000);

    this.animationList.deadIdle = new Animation('deadIdle', platformer.textures.player.deadIdle, 100, { loop : false, cancelable : false });
    this.animationList.deadFalling = new Animation('deadFalling', platformer.textures.player.deadFalling, 0, { loop : false, cancelable : true });

    this.animationList.bowAttack = new Animation('bowAttack', platformer.textures.player.bowAttack, 150, { cancelable : false });
    this.animationList.knifeAttack = new Animation('knifeAttack', platformer.textures.player.knifeAttack, 150, { cancelable : false });
    this.animationList.swordAttack = new Animation('swordAttack', platformer.textures.player.swordAttack, 75, { cancelable : false });
    this.animationList.fireBallAttack = new Animation('fireBallAttack', platformer.textures.player.knifeAttack, 150, { cancelable : false });


    this.update = function(){
        this.updateMovement();
        this.updateInteraction();
        this.updateObject();
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
                this.setCanDropCoin(false);
                this.setDamage(this, 1000, 0, 12, 2);
            }
        }
    }



    /**
    * Effets de sang
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
                    this.setAnimation(this.animationList.bowAttack);
                }
                else if(selectedWeapon.getName() == 'knife'){
                    this.setAnimation(this.animationList.knifeAttack);
                }
                else if(selectedWeapon.getName() == 'sword'){
                    this.setAnimation(this.animationList.swordAttack);
                }
                else if(selectedWeapon.getName() == 'fireBallSpell'){
                    this.setAnimation(this.animationList.fireBallAttack);
                }

                this.setAttacking(false);
            }
            else if(this.isJumping()){
                if(this.isDoubleJumping()){
                    this.setAnimation(this.animationList.doubleJumping);
                    this.setDoubleJumping(false);
                }
                else{
                    this.setAnimation(this.animationList.jumping);
                }
            }
            else if(this.isFalling()){
                this.setAnimation(this.animationList.falling);
            }
            else if(this.left || this.right){
                this.setAnimation(this.animationList.walking);
            }
            else{
                this.setAnimation(this.animationList.idle);
            }
        }
        else{
            if(this.isBlockedDown()){
                this.setAnimation(this.animationList.deadIdle);
            }
            else{
                this.setAnimation(this.animationList.deadFalling);
            }
        }
    }

    this.setHealth = function(h){
        health = toFloat(h);

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
                        var tile = tiles[i];
                        if(tile.isBreakable()){
                            if(this.getRangeBox().intersects(tile)){
                                tile.break();
                            }
                        }
                    }
            }
            else{
                var animDelay = 0;
                var weaponName = weapon.getName();

                // on récupère le délai que l'animation va prendre pour envoyer le projectile une fois l'animation finie
                if(weaponName == 'bow'){
                    animDelay = this.animationList.bowAttack.getSpeed();
                }
                else if(weaponName == 'knife'){
                    animDelay = this.animationList.knifeAttack.getSpeed();
                }
                else if(weaponName == 'fireBallSpell'){
                    animDelay = this.animationList.fireBallAttack.getSpeed();
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

        damages = amount * this.getBonus('strength') / entity.getBonus('resistance');

        entity.setHealth(entity.getHealth() - damages);
        entity.bloodSplash(originDirection, bloodMultiplier);

        if(!entity.isDead() && !entity.isBleeding()){
            var rand = Math.random();

            if(rand > 1 - entity.property.bleedingChance){
                entity.setBleeding(true);
                entity.bleed(amount);
            }
        }

    }

    /**
    * Fixe un timer qui va enlever 25% des dégâts qui ont causé la blessure chaque seconde avec un effet de goutte de sang
    */
    this.bleed = function(damageAmount){
        // on stoppe la perte de vie quand on descend sous la barre des 25% de vie
        var minHealthValue = self.property.maxHealth * 0.25;

        self.setDamage(self, damageAmount * 0.25, 0, 0.25, 3);

        if(self.getHealth() <= minHealthValue && self.isBleeding()){
            self.setHealth(minHealthValue);
            self.setBleeding(false);
        }
        else{
            // on programme un nouveau bleed
            level.getTimers().addTimer(function(){
                if(self.isBleeding()){
                    self.bleed(damageAmount);
                }
            }, 2000);
        }
    }

    this.minBloodAmount = function(){
        return parseInt(1 + ((this.width * this.height) / (platformer.tileSizeX * platformer.tileSizeY)) * 1, 10);
    }
    this.maxBloodAmount = function(){
        return parseInt(1 + ((this.width * this.height) / (platformer.tileSizeX * platformer.tileSizeY)) * 12, 10);
    }


    this.setDead = function(dropCoin){
        if(typeof dropCoin === 'undefined'){
            dropCoin = false;
        }
        if(!dead){
            if(this.canDropCoin()){
                level.spawnLoot(new Coin(level, this.getCenter(), true));
            }

            dead = true;
            vx = 0;
            vy = 0;
            this.left = false;
            this.right = false;
            this.setColor('#a6374b');
            this.setBleeding(false);

            if(this.constructor.name == 'Player'){
                document.dispatchEvent(platformer.events.playerdeath);
            }
        }
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

    this.setCanDropCoin = function(b){
        dropCoin = b;
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
    this.canDropCoin = function(){ return dropCoin; }
}
