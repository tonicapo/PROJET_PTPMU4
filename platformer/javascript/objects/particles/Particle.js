function Particle(level, position, width, height, duration, animated){
    if(typeof animated === 'undefined'){
        animated = false;
    }
    MapObject.call(this, level, position.x, position.y, width, height, animated);
    var self = this;

    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    var velocity = {
        vx : 0,
        vy : 0
    };
    var friction = {
        rx : 0,
        ry : 0
    };

    var angle = 0;

    if(duration != -1){
        level.getTimers().addTimer(function(){
            self.setDirty(true);
        }, duration);
    }

    this.update = function(){
        this.updateBehaviour();
        this.updateParticuleMovement();
        this.updateMovement();
    }

    this.updateParticuleMovement = function(){
        this.left = !(velocity.x != 0 && velocity.y < 0);
        this.right = !(velocity.x != 0 && velocity.y > 0);

        var x = toFloat(velocity.vx * Math.cos(angle * Math.PI / 180));
        var y = toFloat(velocity.vy * Math.cos(angle * Math.PI / 180));

        this.setVector(x , y, true);
    }

    this.setVelocity = function(x, y){
        velocity.vx = x;
        velocity.vy = y;
    }

    this.setFriction = function(x, y){
        friction.rx = x;
        friction.ry = y;
    }

    this.setSpread = function(spread){
        angle = spread;
    }

    this.updateBehaviour = function(){
        if(self.isBlockedDown()){
            velocity.vy = 0;
        }
        if(self.isBlockedUp()){
            velocity.vy = 0;
        }

        if(self.isBlockedLeft()){
            velocity.vx = 0;
        }
        if(self.isBlockedRight()){
            velocity.vx = 0;
        }


        if(velocity.vx > 0){
            velocity.vx -= friction.rx;
            if(velocity.vx < 0){
                velocity.vx = 0;
            }
        }
        else if(velocity.vx < 0){
            velocity.vx += friction.rx;
            if(velocity.vx > 0){
                velocity.vx = 0;
            }
        }

        if(velocity.vy < 0){
            velocity.vy += friction.ry;
            if(velocity.vy > 0){
                velocity.vy = 0;
            }
        }
        else if(velocity.vy > 0){
            velocity.vy -= friction.ry;
            if(velocity.vy < 0){
                velocity.vy = 0;
            }
        }
    }


    this.render = function(ctx, panX, panY){
        ctx.save();
        ctx.fillStyle = this.getColor();
        ctx.fillRect(this.x - panX, this.y - panY, this.width, this.height);
        ctx.restore();
    }
}
