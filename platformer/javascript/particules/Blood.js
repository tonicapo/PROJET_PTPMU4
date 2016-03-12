function Blood(level, position, direction){
    position.x += randomInt(-4, 4);
    position.y += randomInt(-4, 4);

    Particle.call(this, level, position, randomInt(4, 10), randomInt(4, 10), -1);

    this.property = {
        fallSpeed : 2,
        maxFallSpeed : 8,
        speed : randomFloat(0.2, 2),
        stopSpeed : 0.2,
        maxSpeed : randomFloat(2, 18)
    };

    var xmin = -14;
    var xmax = 14;
    var ymin = -14;
    var ymax = -4;

    if(direction == 1){
        xmin = 0;
    }
    else if(direction == 0){
        xmax = 0;
    }
    else{
        xmin = -2;
        xmax = 2;

        ymin = -18;
    }

    var xx = randomFloat(xmin, xmax);
    var yy = randomFloat(ymin, ymax);

    this.setColor('#a6374b');
    this.setVelocity(xx, yy);
    this.setFriction(0.1, 0.15);
}
