function Arrow(level, originEntity, targets, position, direction){
    Projectile.call(this, level, originEntity, targets, platformer.weapons.bow, position, direction, 40, 10);

    this.animations.moving = new Animation('moving', platformer.textures.items.arrowMoving, 150);
    this.animations.idle = new Animation('idle', platformer.textures.items.arrowIdle, 0);

    this.property.speed = 3;
    this.property.stopSpeed = 1;
    this.property.maxSpeed = 14;

    this.setMaxDistance(500);
}
