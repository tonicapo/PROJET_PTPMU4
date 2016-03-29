function Weapon(level, name, position, delay, animationFrames, options){
    if(typeof position === 'undefined'){
        position = new Position(0, 0);
    }

    Loot.call(this, level, position, delay);
    this.property = new Object;

    this.property.damage = (typeof options.damage !== 'undefined') ? options.damage : 0;
    // effet de recul
    this.property.knockback = (typeof options.knockback !== 'undefined') ? options.knockback : 0;
    // portée
    this.property.range = (typeof options.range !== 'undefined') ? options.range : 0;
    // delais pour effectuer une attaque
    this.property.delay = (typeof options.delay !== 'undefined') ? options.delay : 0;
    // permet d'affecter un coefficient pour réduire / augmenter la quantité de sang projetée après un coup
    this.property.bleeding = (typeof options.bleeding !== 'undefined') ? options.bleeding : 1;
    // ajoute un projectile
    this.property.projectile = (typeof options.projectile !== 'undefined') ? options.projectile : false;

    this.setHitBox(24 * platformer.scale, 24 * platformer.scale);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.animationList.idle = new Animation('idle', animationFrames, 300);

    this.property.fallSpeed = 3;
    this.property.maxFallSpeed = 3;
    this.property.speed = 1;
    this.property.stopSpeed = 0.5;
    this.property.maxSpeed = 2;

    this.setSpread(0);
    this.setVelocity(0, -10);
    this.setFriction(0, 0.2);


    this.pickLoot = function(entity){
        if(entity.constructor.name == 'Player'){
            entity.clearInventory();
            entity.addInventory(this);
            entity.setSelectedItem(0);
            this.setDirty(true);
        }
    }

    this.getName = function(){ return name; }
    this.getTexture = function(){ return animationFrames[0]; }
}


function SwordItem(level, position){
    Weapon.call(this, level, 'sword',  position, 100, platformer.textures.items.sword, {
        damage : 7.5,
        knockback : 10,
        bleeding : 4,
        range : 50,
        delay : 500,
        projectile : false
    });
}

function BowItem(level, position){
    Weapon.call(this, level, 'bow', position, 100, platformer.textures.items.bow, {
        damage : 8,
        knockback : 8,
        bleeding : 4,
        range : 225,
        delay : 1000,
        projectile : true
    });
}

function KnifeItem(level, position){
    Weapon.call(this, level, 'knife', position, 100, platformer.textures.items.knife, {
        damage : 7.5,
        knockback : 6,
        bleeding : 2.5,
        range : 200,
        delay : 500,
        projectile : true
    });
}

function BossFeetItem(level, position){
    Weapon.call(this, level, 'bossFeet', position, 100, platformer.textures.items.bossFeet, {
        damage : 8,
        knockback : 8,
        bleeding : 4,
        range : 0,
        delay : 1000,
        projectile : false
    });
}

function FireBallSpellItem(level, position){
    Weapon.call(this, level, 'fireBallSpell', position, 100, platformer.textures.items.fireBallSpell, {
        damage : 10,
        knockback : 16,
        bleeding : 6,
        range : 500,
        delay : 1500,
        projectile : true
    });
}
