function Player(level, position){
    Entity.call(this, level, position, platformer.tileSizeX, platformer.tileSizeY);

    this.property = {
        speed : 1,
        stopSpeed : 0.5,
        maxSpeed : 4,
        fallSpeed : 2,
        maxFallSpeed : 6
    };

    this.keyUp = function(key){
        if(key == platformer.keylist.mvt_left){
            this.left = false;
        }
        else if(key == platformer.keylist.mvt_right){
            this.right = false;
        }
        else if(key == platformer.keylist.mvt_up){
            this.up = false;
        }
        else if(key == platformer.keylist.mvt_down){
            this.down = false;
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
            this.up = true;
        }
        else if(key == platformer.keylist.mvt_down){
            this.down = true;
        }
    }
}
