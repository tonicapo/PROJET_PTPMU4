function Player(level, position){
    Entity.call(this, level, position, platformer.tileSizeX, platformer.tileSizeY);

    this.property = {
        speed : 1,
        stopSpeed : 0.75,
        maxSpeed : 6,
        fallSpeed : 2,
        maxFallSpeed : 8,
        jumpHeight : 8,
        doubleJumpHeight : 4
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
        if(key == platformer.keylist.mvt_left){
            this.left = true;
        }
        else if(key == platformer.keylist.mvt_right){
            this.right = true;
        }
        else if(key == platformer.keylist.mvt_up){
            this.setJumping();
        }
    }
}
