function FireBall(level, originEntity, targets, position, direction){
    Projectile.call(this, level, originEntity, targets, platformer.weapons.fireballSpell, position, direction, 32, 32);
    var self = this;

    this.animations.moving = new Animation('moving', platformer.textures.items.fireBallMoving, 100);
    this.animations.idle = new Animation('idle', platformer.textures.items.fireBallMoving, 100);
    this.animations.exploding = new Animation('exploding', platformer.textures.items.fireBallExploding, 150);

    this.property.speed = 1;
    this.property.stopSpeed = 1;
    this.property.maxSpeed = 6;

    this.setMaxDistance(600);
    this.setDestructOnStopped(false);
    this.setRenderBox(32, 32);
    this.setFollowingTarget(false);

    this.animate = function(){
        if(this.isStopped()){
            this.setAnimation(this.animations.exploding);

            level.getTimers().addTimer(function(){
                self.setDirty(true);
            }, this.animations.exploding.getDuration());
        }
        else{
            this.setAnimation(this.animations.moving);
        }
    }
}
