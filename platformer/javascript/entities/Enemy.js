function Enemy(level, position){
    Hostile.call(this, level, position, 60, 85);

    this.setRenderBox(80 * platformer.scale, 64 * platformer.scale);

    this.property = {
        speed : 0.1,
        stopSpeed : 0.25,
        maxSpeed : 1.5,
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
