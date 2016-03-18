function FireBall(level, originEntity, targets, position, direction){
    Projectile.call(this, level, originEntity, targets, platformer.weapons.fireballSpell, position, direction, 32, 32);
    var self = this;

    this.animationList.moving = new Animation('moving', platformer.textures.items.fireBallMoving, 100);
    this.animationList.idle = new Animation('idle', platformer.textures.items.fireBallMoving, 100);

    this.property.speed = 1;
    this.property.stopSpeed = 1;
    this.property.maxSpeed = 6;

    this.setMaxDistance(600);
    this.setDestructOnStopped(false);
    this.setRenderBox(32, 32);
    this.setFollowingTarget(false);

    this.animate = function(){
        if(this.isStopped()){
            var amount = randomInt(2, 6);
            var delay;
            var position;
            var target = this.getTarget();

            position = new Position(this.x - this.getRenderBox().width / 2, this.y - this.getRenderBox().height / 2);


            delay = randomInt(50, 200);

            level.getTimers().addTimer(function(){
                level.spawnParticle(new FireBallExplosion(level, position));
            }, delay);


            this.setDirty(true);
        }
        else{
            this.setAnimation(this.animationList.moving);
        }
    }
}
