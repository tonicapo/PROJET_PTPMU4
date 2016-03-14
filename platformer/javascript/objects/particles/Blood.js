function Blood(level, position, direction){
    position.x += randomFloat(-4, 4);
    position.y += randomFloat(-4, 4);

    Particle.call(this, level, position, 6, 6, -1);

    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.property.fallSpeed = 3;
    this.property.maxFallSpeed = 8;
    this.property.speed = randomFloat(0.25, 0.75);
    this.property.stopSpeed = 0.2;
    this.property.maxSpeed = 4;

    var xmin = -16;
    var xmax = 16;
    var ymin = -10;
    var ymax = -4;

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
    else{
        xmin = -3;
        xmax = 3;

        ymin = -18;
    }

    var xx = randomFloat(xmin, xmax);
    var yy = randomFloat(ymin, ymax);

    this.setColor('#a6374b');
    this.setVelocity(xx, yy);
    this.setSpread(angle);
    this.setFriction(0.1, 0.25);
}
