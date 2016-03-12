function Knife(level, originEntity, targets, weapon, position, direction){
    Projectile.call(this, level, originEntity, targets, weapon, position, direction, 12, 8);

    this.animations = {
        moving : new Animation('moving', platformer.textures.items.knifeMoving, 1000),
        idle : new Animation('idle', platformer.textures.items.knifeIdle, 0)
    };

    this.property = {
        fallSpeed : 0,
        maxFallSpeed : 0,
        speed : 3,
        stopSpeed : 100,
        maxSpeed : 10
    };
}
