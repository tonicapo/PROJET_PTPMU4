function Arrow(level, originEntity, targets, weapon, position, direction){
    Projectile.call(this, level, originEntity, targets, weapon, position, direction, 20, 10);

    this.animations = {
        moving : new Animation('moving', platformer.textures.items.arrowMoving, 150),
        idle : new Animation('idle', platformer.textures.items.arrowIdle, 0)
    };

    this.property = {
        fallSpeed : 0,
        maxFallSpeed : 0,
        speed : 3,
        stopSpeed : 100,
        maxSpeed : 12
    };
}
