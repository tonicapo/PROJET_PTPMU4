function Enemy(level, position){
    Hostile.call(this, level, position, 60, 85, platformer.tileSizeX, platformer.tileSizeY);

    this.property = {
        speed : 1,
        stopSpeed : 0.75,
        maxSpeed : 6,
        fallSpeed : 2,
        maxFallSpeed : 8,
        jumpHeight : 8,
        doubleJumpHeight : 4,

        maxHealth : 10,
        baseRange : 10,

        bleedingChance : 0.1
    };

    this.setHealth(this.property.maxHealth);
    this.setColor('#D9828C');
    this.addInventory(platformer.weapons.sword);
}
