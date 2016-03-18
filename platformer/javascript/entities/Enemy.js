function Enemy(level, position){
    AI_Entity.call(this, level, position, 60, 85);

    this.setRenderBox(80 * platformer.scale, 64 * platformer.scale);

    this.property.speed = 0.1;
    this.property.stopSpeed = 0.25;
    this.property.maxSpeed = 2;
    this.property.fallSpeed = 2;
    this.property.maxFallSpeed = 8;
    this.property.jumpHeight = 3;
    this.property.doubleJumpHeight = 4;
    this.property.maxHealth = 10;
    this.property.baseRange = 0;
    this.property.bleedingChance = 0.2;

    this.setHealth(this.property.maxHealth);
    this.setColor('#D9828C');
    this.addInventory(platformer.weapons.sword);
    this.setCanDropCoin(true);


    this.addInventory(platformer.weapons.sword);
    this.setSelectedItem(0);

    this.setHostile(true);
    this.setIdle(false);
}
