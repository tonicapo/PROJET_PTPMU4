function Coin(level, position, gravity, random){
    Loot.call(this, level, new Position(position.x - platformer.tileSizeX / 2, position.y - platformer.tileSizeY / 2));

    if(typeof gravity === 'undefined'){
        gravity = true;
    }
    if(random === true){
        this.setVelocity(randomChoiceArray([-20, 20]), randomFloat(-14, -18));
        this.setSpread(0);
        this.setFriction(randomFloat(0.5, 1), 0.5);
    }

    this.property.fallSpeed = 3;
    this.property.maxFallSpeed = 8;
    this.property.speed = randomFloat(0.25, 0.75);
    this.property.stopSpeed = 0.2;
    this.property.maxSpeed = 4;

    this.setHitBox(11 * platformer.scale, 10 * platformer.scale);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.animationList.idle = new Animation('idle', platformer.textures.items.coin, 250);

    this.pickLoot = function(entity){
        entity.addCoin();
    }
}
