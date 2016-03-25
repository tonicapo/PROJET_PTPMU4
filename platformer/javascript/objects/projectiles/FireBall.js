function FireBall(level, originEntity, targets, position, direction){
    Projectile.call(this, level, originEntity, targets, platformer.weapons.fireballSpell, position, direction, 32, 32);
    var self = this;

    this.animationList.moving = new Animation('moving', platformer.textures.items.fireBallMoving, 100);
    this.animationList.idle = new Animation('idle', platformer.textures.items.fireBallMoving, 100);

    this.property.speed = 0.1;
    this.property.stopSpeed = 0.5;
    this.property.maxSpeed = 3;

    this.setMaxDistance(600);
    this.setDestructOnStopped(false);
    this.setFollowingTarget(false);
    this.setDeflectable(true);

    this.animate = function(){
        if(this.isStopped()){
            this.setDirty(true);
        }
        else{
            this.setAnimation(this.animationList.moving);
        }
    }
}
