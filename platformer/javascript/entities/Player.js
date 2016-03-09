function Player(level, position){
    Entity.call(this, level, position, 52, 80, 64 * platformer.scale, 64 * platformer.scale);

    this.property = {
        speed : 1,
        stopSpeed : 0.75,
        maxSpeed : 6,
        fallSpeed : 2,
        maxFallSpeed : 8,
        jumpHeight : 8,
        doubleJumpHeight : 4
    };

    this.animations = {
        idle : new Animation('idle', platformer.textures.player.idle, 1000, { random : true }),
        walking : new Animation('walking', platformer.textures.player.walking, 100),
        jumping : new Animation('jumping', platformer.textures.player.jumping, 0),
        doubleJumping : new Animation('doubleJumping', platformer.textures.player.jumping, 0, { loop : false, cancelable : true }),
        falling : new Animation('falling', platformer.textures.player.falling, 1000),
        deadIdle : new Animation('deadIdle', platformer.textures.player.deadIdle, 75, { loop : false, cancelable : false }),
        deadFalling : new Animation('deadFalling', platformer.textures.player.deadFalling, 0, { loop : false, cancelable : true })
    };

    this.animate = function(){
        if(!this.isDead()){
            if(this.isJumping()){
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
            this.setDead();
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
