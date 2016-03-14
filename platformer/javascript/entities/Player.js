function Player(level, position){
    Entity.call(this, level, position, 60, 85);

    this.setRenderBox(80 * platformer.scale, 64 * platformer.scale);

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
    this.addInventory(platformer.weapons.fireballSpell);

    this.setSelectedItem(1);

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
