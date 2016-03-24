function Player(level){
    Entity.call(this, level, getPositionAtCoord(0, 0), 60, 85);

    var self = this;
    this.setRenderBox(80 * platformer.scale, 64 * platformer.scale);

    // events liés au player
    platformer.events.playerdeath = new CustomEvent('playerdeath');
    platformer.events.playerkill = new CustomEvent('playerkill');


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

    var stats = { };

    this.setCanDropCoin(false);
    this.addInventory(platformer.weapons.sword);
    this.addInventory(platformer.weapons.bow);
    this.addInventory(platformer.weapons.knife);
    this.setSelectedItem(2);

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
    onetime(document, 'playerdeath', function(e){
        e.stopPropagation();
        /**
        - Ajoute une mort au compteur de mort du player
        */
        console.log(stats);
    });
}