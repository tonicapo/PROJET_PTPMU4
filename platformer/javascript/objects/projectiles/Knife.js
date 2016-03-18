function Knife(level, originEntity, targets, position, direction){
    Projectile.call(this, level, originEntity, targets, platformer.weapons.knife, position, direction, 20, 8);

    this.animationList.moving = new Animation('moving', platformer.textures.items.knifeMoving, 1000);
    this.animationList.idle = new Animation('idle', platformer.textures.items.knifeIdle, 0);

    this.property.speed = 3;
    this.property.stopSpeed = 1;
    this.property.maxSpeed = 10;

    this.setMaxDistance(350);
}
