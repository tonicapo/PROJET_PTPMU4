function Player(level, position){
    Entity.call(this, level, position, 60, 85);

    var self = this;
    this.setRenderBox(80 * platformer.scale, 64 * platformer.scale);

    this.property.speed = 1;
    this.property.stopSpeed = 0.75;
    this.property.maxSpeed = 6;
    this.property.fallSpeed = 2;
    this.property.maxFallSpeed = 8;
    this.property.jumpHeight = 8;
    this.property.doubleJumpHeight = 4;

    this.property.maxHealth = 20;
    this.property.baseRange = 20;
    this.property.bleedingChance = 0.1;


    var coins = 0;

    this.setHealth(this.property.maxHealth);
    this.setCanDropCoin(false);
    this.addInventory(platformer.weapons.sword);
    this.addInventory(platformer.weapons.bow);
    this.addInventory(platformer.weapons.knife);
    this.addInventory(platformer.weapons.fireballSpell);

    this.setSelectedItem(2);

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

    this.getCoins = function(){
        return coins;
    }

    this.addCoin = function(){
        coins += 1;
    }

    document.addEventListener('playerdeath', function(e){
        e.preventDefault();

    });
}
