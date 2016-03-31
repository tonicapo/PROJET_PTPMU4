function Enemy(level, position){
    AI_Entity.call(this, level, position, 60, 85);

    var self = this;

    this.setRenderBox(80 * platformer.scale, 64 * platformer.scale);
    this.setViewBoxOffsetY(Math.abs(this.height - platformer.tileSizeY) + 2);
    this.setRangeBoxOffsetY(Math.abs(this.height - platformer.tileSizeY) + 2);

    this.setColor('#D9828C');
    this.setCanDropLoot(true);

    this.setDeathParticle(Bone);
    this.setBloodRatio(0.05);

    this.setIdle(false);
    this.setHostile(true);
}

function Archer(level, position){
    Enemy.call(this, level, position);

    this.property.speed = 0.1;
    this.property.stopSpeed = 0.75;
    this.property.maxSpeed = 2;
    this.property.fallSpeed = 2;
    this.property.maxFallSpeed = 8;
    this.property.jumpHeight = 3;
    this.property.doubleJumpHeight = 4;
    this.property.maxHealth = 7.5 * platformer.difficulty.healthRatio;
    this.property.baseRange = 100;
    this.property.bleedingChance = 0.3;
    this.property.attackCooldown = 750;
    this.property.reactionTime = 400 * platformer.difficulty.reactionTimeRatio;
    this.property.viewDistance = 500;


    this.addInventory(new BowItem(level));
    this.setSelectedItem(0);


    this.animationList.idle = new Animation('idle', platformer.textures.skeleton_archer.idle, 1000, { random : true });
    this.animationList.walking = new Animation('walking', platformer.textures.skeleton_archer.walking, 80);
    this.animationList.walkingSpeedPotion = new Animation('walkingSpeedPotion', platformer.textures.skeleton_archer.walking, 60);

    this.animationList.jumping = new Animation('jumping', platformer.textures.skeleton_archer.jumping, 0);
    this.animationList.falling = new Animation('falling', platformer.textures.skeleton_archer.falling, 1000);

    this.animationList.deadIdle = new Animation('deadIdle', platformer.textures.skeleton_archer.deadIdle, 100, { loop : false, cancelable : false });
    this.animationList.deadFalling = new Animation('deadFalling', platformer.textures.skeleton_archer.deadFalling, 0, { loop : false, cancelable : true });

    this.animationList.bowAttack = new Animation('bowAttack', platformer.textures.skeleton_archer.bowAttack, 140, { cancelable : false });
}

function Knight(level, position){
    Enemy.call(this, level, position);

    this.property.speed = 0.1;
    this.property.stopSpeed = 0.2;
    this.property.maxSpeed = 1.5;
    this.property.fallSpeed = 2;
    this.property.maxFallSpeed = 8;
    this.property.jumpHeight = 3;
    this.property.doubleJumpHeight = 4;
    this.property.maxHealth = 12 * platformer.difficulty.healthRatio;
    this.property.baseRange = 25;
    this.property.bleedingChance = 0.15;
    this.property.attackCooldown = 700;
    this.property.reactionTime = 400 * platformer.difficulty.reactionTimeRatio;
    this.property.viewDistance = 350;

    this.addInventory(new SwordItem(level));
    this.setSelectedItem(0);


    this.animationList.idle = new Animation('idle', platformer.textures.skeleton_knight.idle, 1000, { random : true });
    this.animationList.walking = new Animation('walking', platformer.textures.skeleton_knight.walking, 100);
    this.animationList.walkingSpeedPotion = new Animation('walkingSpeedPotion', platformer.textures.skeleton_knight.walking, 80);

    this.animationList.jumping = new Animation('jumping', platformer.textures.skeleton_knight.jumping, 0);
    this.animationList.falling = new Animation('falling', platformer.textures.skeleton_knight.falling, 1000);

    this.animationList.deadIdle = new Animation('deadIdle', platformer.textures.skeleton_knight.deadIdle, 100, { loop : false, cancelable : false });
    this.animationList.deadFalling = new Animation('deadFalling', platformer.textures.skeleton_knight.deadFalling, 0, { loop : false, cancelable : true });

    this.animationList.swordAttack = new Animation('swordAttack', platformer.textures.skeleton_knight.swordAttack, 70, { cancelable : false });
}
