function Player(level, position){
    Entity.call(this, level, position, 60, 85, 64 * platformer.scale, 64 * platformer.scale);

    this.property = {
        speed : 1,
        stopSpeed : 0.75,
        maxSpeed : 6,
        fallSpeed : 2,
        maxFallSpeed : 8,
        jumpHeight : 8,
        doubleJumpHeight : 4,

        maxHealth : 20,
        baseRange : 20,
        bleedingChance : 0.05
    };

    this.setHealth(this.property.maxHealth);

    this.addInventory(platformer.weapons.sword);
    this.addInventory(platformer.weapons.bow);
    this.addInventory(platformer.weapons.knife);

    this.setSelectedItem(1);


    this.animations = {
        idle : new Animation('idle', platformer.textures.player.idle, 1000, { random : true }),
        walking : new Animation('walking', platformer.textures.player.walking, 100),
        jumping : new Animation('jumping', platformer.textures.player.jumping, 0),
        doubleJumping : new Animation('doubleJumping', platformer.textures.player.jumping, 0, { loop : false, cancelable : true }),
        falling : new Animation('falling', platformer.textures.player.falling, 1000),

        deadIdle : new Animation('deadIdle', platformer.textures.player.deadIdle, 75, { loop : false, cancelable : false }),
        deadFalling : new Animation('deadFalling', platformer.textures.player.deadFalling, 0, { loop : false, cancelable : true }),

        bowAttack : new Animation('bowAttack', platformer.textures.player.bowAttack, 150, { cancelable : false }),
        knifeAttack : new Animation('knifeAttack', platformer.textures.player.knifeAttack, 150, { cancelable : false }),
        swordAttack : new Animation('swordAttack', platformer.textures.player.swordAttack, 150, { cancelable : false })
    };

    this.keyUp = function(key){
        if(key == platformer.keylist.mvt_left){
            this.left = false;
        }
        else if(key == platformer.keylist.mvt_right){
            this.right = false;
        }
    }

    this.keyDown = function(key){
        if(this.isDead()){
            return;
        }

        if(key == platformer.keylist.action_attack){
            this.attack(level.getEntities());
        }
        else if(key == platformer.keylist.mvt_left){
            this.left = true;
            this.setDirection(0);
        }
        else if(key == platformer.keylist.mvt_right){
            this.right = true;
            this.setDirection(1);
        }
        else if(key == platformer.keylist.mvt_up){
            this.setJumping();
        }
    }
}
