function Projectile(level, originEntity, targets, weapon, position, direction, width, height){
    MapObject.call(this, level, position.x - width / 2, position.y - height / 2, width, height);

    var self = this;
    var targetEntity;
    var stopped = false;
    var offsetX = 0;
    var offsetY = 0;
    var originPosition = this.getCenter();

    var maxDistance;
    var destructOnStopped = false;
    var followTarget = true;

    if(direction == 1){
        this.right = true;
        this.left = false;
    }
    else if(direction == 0){
        this.left = true;
        this.right = false;
    }

    this.property.fallSpeed = 0;
    this.property.maxFallSpeed = 0;
    this.property.speed = 0;
    this.property.stopSpeed = 0;
    this.property.maxSpeed = 0;

    this.animations.moving = null,
    this.animations.idle = null;

    this.setDirection(direction);
    this.setFixedToBottom(false);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);


    this.update = function(){
        this.updateMovement();
        this.updateAnimation();
        updateStatus();

        if(stopped){
            if(followTarget && !destructOnStopped && typeof targetEntity !== 'undefined'){
                this.x = targetEntity.x + offsetX;
                this.y = targetEntity.y + offsetY;

                if(targetEntity.isDead()){
                    self.setDirty(true);
                }
            }
        }

        if(this.x - originPosition.x > maxDistance){
            if(!stopped){
                self.setDirty(true);
            }
        }

        if(stopped && destructOnStopped){
            self.setDirty(true);
        }
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
            self.x += (direction == 1) ? self.width / 2 : -(self.width / 2);

            disableMovement();

            // on boucle dans la liste des tiles visibles pour savoir si on a touché un tile cassable
            var tiles = level.getMap().getVisibleTiles();

            for(var i = 0, n = tiles.length; i < n; i++){
                if(tiles[i].isBreakable()){
                    if(self.intersects(tiles[i])){
                        tiles[i].break();
                    }
                }
            }

            stopped = true;
        }
        else{
            for(var i in targets){
                // on a touché une des cibles
                if(self.intersects(targets[i]) && !targets[i].isDead() && targets[i] !== originEntity){
                    var currentPosition = self.getCenter();
                    var distance = Math.abs(currentPosition.x - originPosition.x);

                    targetEntity = targets[i];

                    // position de la flèche sur l'entité touchée
                    offsetX = self.x - targetEntity.x;
                    offsetY = self.y - targetEntity.y;

                    // stoppe complètement le mouvement du projectile
                    disableMovement();

                    originEntity.hit(targets[i], weapon, distance, direction);
                    stopped = true;

                    break;
                }
            }
        }
    }

    function disableMovement(){
        self.left = false;
        self.right = false;
        self.setVector(0, 0);
    }

    this.isDestructOnStopped = function(){ return destructOnStopped; }
    this.getTarget = function(){ return targetEntity; }
    this.isStopped = function(){ return stopped; }
    this.getFollowingTarget = function(){ return followTarget; }

    this.setMaxDistance = function(d){
        maxDistance = d;
    }

    this.setDestructOnStopped = function(b){
        destructOnStopped = b;
    }

    this.setFollowingTarget = function(b){
        followTarget = b;
    }
}
