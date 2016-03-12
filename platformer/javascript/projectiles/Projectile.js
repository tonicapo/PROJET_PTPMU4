function Projectile(level, originEntity, targets, weapon, position, direction, width, height){
    MapObject.call(this, level, position.x - width / 2, position.y - height / 2, width, height, platformer.tileSizeX, platformer.tileSizeY)

    var self = this;
    var targetEntity;
    var stopped = false;

    if(direction == 1){
        this.right = true;
        this.left = false;
    }
    else if(direction == 0){
        this.left = true;
        this.right = false;
    }

    this.animations = {
        moving : null,
        idle : null
    };

    this.setDirection(direction);
    this.setFixedToBottom(false);

    level.getTimers().addTimer(function(){
        if(!self.isStopped()){
            self.setDirty(true);
        }
    }, 1000);

    this.update = function(){
        this.updateMovement();
        this.updateAnimation();

        updateStatus();
    }


    this.animate = function(){
        if(this.isStopped()){
            this.setAnimation(this.animations.idle);
        }
        else{
            this.setAnimation(this.animations.moving);
        }
    }

    function updateStatus(){
        if(self.isBlockedLeft() || self.isBlockedRight()){
            disableMovement();
            stopped = true;
        }
        else{
            for(var i in targets){
                // on a touché une des cibles
                if(self.intersects(targets[i]) && !targets[i].isDead() && targets[i] !== originEntity){
                    disableMovement();
                    originEntity.hit(targets[i], weapon, direction);
                    targetEntity = targets[i];
                    stopped = true;
                }
            }
        }
    }

    function disableMovement(){
        self.left = false;
        self.right = false;
        self.setVector(0, 0);
    }

    this.getTarget = function(){ return targetEntity; }
    this.isStopped = function(){ return stopped; }
}
