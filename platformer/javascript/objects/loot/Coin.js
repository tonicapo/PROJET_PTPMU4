function Valuable(level, position, delay, gravity){
    Loot.call(this, level, new Position(position.x - platformer.tileSizeX / 2, position.y - platformer.tileSizeY / 2), delay);

    if(typeof gravity === 'undefined'){
        gravity = true;
    }

    this.enableGravity(gravity);

    this.property.fallSpeed = 3;
    this.property.maxFallSpeed = 8;
    this.property.speed = randomFloat(0.25, 0.75);
    this.property.stopSpeed = 0.2;
    this.property.maxSpeed = 4;

    if(gravity){
        this.setSpread(0);
        this.setVelocity(0, -10);
        this.setFriction(0, 0.2);
    }


    this.setHitBox(11 * platformer.scale, 10 * platformer.scale);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.pickLoot = function(entity){
        entity.addCoin(this.getDropAmount());
        this.setDirty(true);
    }
}

function Ruby(level, position, delay, gravity){
    Valuable.call(this, level, position, delay, gravity);
    this.animationList.idle = new Animation('idle', platformer.textures.items.ruby, 250);

    this.setDropAmount(10);
}

function Coin(level, position, delay, gravity){
    Valuable.call(this, level, position, delay, gravity);
    this.animationList.idle = new Animation('idle', platformer.textures.items.coin, 250);

    this.setDropAmount(1);
}
