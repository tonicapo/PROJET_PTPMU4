function Blood(level, position, direction){
    var self = this;

    position.x += randomFloat(-8, 8);
    position.y += randomFloat(-8, 8);

    Particle.call(this, level, position, 6, 6, 10000 + randomInt(0, 500), false);

    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.property.fallSpeed = 3;
    this.property.maxFallSpeed = 8;
    this.property.speed = randomFloat(0.25, 0.75);
    this.property.stopSpeed = 1.5;
    this.property.maxSpeed = 4;

    var xmin = -6;
    var xmax = 6;
    var ymin = -12;
    var ymax = -6;

    var angle = 0;

    if(direction == 1){
        xmin = 4;
        xmax = 12;
        angle = 0;
    }
    else if(direction == 0){
        xmax = -4;
        xmin = -12;
        angle = 360;
    }
    else if(direction == 2){
        xmin = -3;
        xmax = 3;

        ymin = -18;
    }


    var xx = randomFloat(xmin, xmax);
    var yy = randomFloat(ymin, ymax);

    this.setColor('#a6374b');
    this.setVelocity(xx, yy);
    this.setSpread(angle);
    this.setFriction(randomFloat(0.1, 0.15), 0.25);
}
