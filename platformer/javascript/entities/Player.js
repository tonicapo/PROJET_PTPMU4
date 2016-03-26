function Player(level){
    Entity.call(this, level, getPositionAtCoord(0, 0), 60, 85);

    var self = this;
    var stats = { };

    this.setRenderBox(80 * platformer.scale, 64 * platformer.scale);

    // events liés au player
    platformer.events.playerdeath = new CustomEvent('playerdeath');
    platformer.events.playerkill = new CustomEvent('playerkill');


    this.animationList.idle = new Animation('idle', platformer.textures.player.idle, 1000, { random : true });
    this.animationList.walking = new Animation('walking', platformer.textures.player.walking, 100);
    this.animationList.walkingSpeedPotion = new Animation('walkingSpeedPotion', platformer.textures.player.walking, 70);
    this.animationList.jumping = new Animation('jumping', platformer.textures.player.jumping, 0);
    this.animationList.doubleJumping = new Animation('doubleJumping', platformer.textures.player.doubleJumping, 150, { loop : true, cancelable : false });
    this.animationList.falling = new Animation('falling', platformer.textures.player.falling, 1000);

    this.animationList.deadIdle = new Animation('deadIdle', platformer.textures.player.deadIdle, 100, { loop : false, cancelable : false });
    this.animationList.deadFalling = new Animation('deadFalling', platformer.textures.player.deadFalling, 0, { loop : false, cancelable : true });

    this.animationList.bowAttack = new Animation('bowAttack', platformer.textures.player.bowAttack, 150, { cancelable : false });
    this.animationList.knifeAttack = new Animation('knifeAttack', platformer.textures.player.knifeAttack, 150, { cancelable : false });
    this.animationList.swordAttack = new Animation('swordAttack', platformer.textures.player.swordAttack, 75, { cancelable : false });
    this.animationList.fireBallAttack = new Animation('fireBallAttack', platformer.textures.player.knifeAttack, 150, { cancelable : false });



    this.property.speed = 1;
    this.property.stopSpeed = 0.75;
    this.property.maxSpeed = 5;
    this.property.fallSpeed = 2;
    this.property.maxFallSpeed = 8;
    this.property.jumpHeight = 8;
    this.property.doubleJumpHeight = 4;

    this.property.maxHealth = 20;
    this.property.baseRange = 25;
    this.property.bleedingChance = 0.1;


    this.setCanDropCoin(false);
    this.addInventory(platformer.weapons.sword);
    this.addInventory(platformer.weapons.bow);
    this.addInventory(platformer.weapons.knife);
    this.setSelectedItem(0);
    this.setBloodRatio(1);
    this.isKnockbackImmune(false);

    this.init = function(){
        stats.coins = 0;
        stats.kills = 0;

        this.setAlive();
        this.initAnimations();
    }

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

    // permet de récupérer la valeur d'une statistique
    this.getStat = function(name){
        return stats[name];
    }

    this.getStats = function(){
        return stats;
    }

    this.addCoin = function(amount){
        stats.coins += amount;
    }

    this.addKill = function(){
        stats.kills += 1;
    }

    this.setSpawn = function(x, y){
        var position = getPositionAtCoord(x, y);

        this.x = position.x;
        this.y = position.y;
    }

    /**
    * Events
    */

    /*
    * TODO : durée de jeu
    */
    onetime(window, 'playerdeath', function(e){
        e.stopPropagation();
        /**
        - Ajoute une mort au compteur de mort du player
        */
        console.log(stats);
    });
}
