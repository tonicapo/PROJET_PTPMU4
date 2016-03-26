function FireBall(level, originEntity, targets, position, direction){
    Projectile.call(this, level, originEntity, targets, platformer.weapons.fireballSpell, position, direction, 32, 32);

    var self = this;
    var focusedEntity;

    var range = 500;

    this.animationList.moving = new Animation('moving', platformer.textures.items.fireBallMoving, 100);
    this.animationList.idle = new Animation('idle', platformer.textures.items.fireBallMoving, 100);

    this.property.speed = 1;
    this.property.stopSpeed = 0.5;
    this.property.maxSpeed = 3;

    this.setMaxDistance(range);
    this.setDestructOnStopped(false);
    this.setFollowingTarget(false);
    this.setDeflectable(true);

    this.y = originEntity.y + this.height / 2


    /**
        La boule de feu va focus l'entité la plus proche en face d'elle parmis la liste des cibles possibles
    */
    var center = this.getCenter();
    var radius = new Rectangle(center.x - range / 2, center.y - range / 2, range, range);

    for(var i = 0, n = targets.length; i < n; i++){
        var t = targets[i];
        if(radius.intersects(this)){
            if(typeof focusedEntity === 'undefined' ||
                (typeof focusedEntity !== 'undefined' && direction == 0 && t.x > focusedEntity.x) ||
                (typeof focusedEntity !== 'undefined' && direction == 1 && t.x < focusedEntity.x)
            ){
                focusedEntity = t;
            }
        }
    }

    this.update = function(){
        if(typeof focusedEntity !== 'undefined'){
            if(this.y > focusedEntity.y){
                this.y -= 0.5;
            }
            else if(this.y < focusedEntity.y){
                this.y += 1;
            }
        }

        this.updateProjectile();
    }

    this.animate = function(){
        if(this.isStopped()){
            level.getTimers().addTimer(function(){
                self.setDirty(true);
            }, 100);
        }
        else{
            this.setAnimation(this.animationList.moving);
        }
    }
}
