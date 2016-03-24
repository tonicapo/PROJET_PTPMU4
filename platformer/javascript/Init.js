var platformer = platformer || {};

platformer.initTextures = function(resources){
    // textures
    platformer.textures.entity = { };



    platformer.textures.player = { };

    platformer.textures.player.jumping = [
        platformer.getSubImage(resources.player, 80, 0, 80, 64)
    ];
    platformer.textures.player.doubleJumping = [
        platformer.getSubImage(resources.player, 0, 0, 80, 64),
        platformer.getSubImage(resources.player, 80, 0, 80, 64)
    ];
    platformer.textures.player.falling = [
        platformer.getSubImage(resources.player, 0, 0, 80, 64)
    ];
    platformer.textures.player.walking = [
        platformer.getSubImage(resources.player, 0, 64, 80, 64),
        platformer.getSubImage(resources.player, 80, 64, 80, 64),
        platformer.getSubImage(resources.player, 0, 64, 80, 64),
        platformer.getSubImage(resources.player, 160, 64, 80, 64)
    ];
    platformer.textures.player.idle = [
        platformer.getSubImage(resources.player, 0, 0, 80, 64)
    ];
    platformer.textures.player.deadIdle = [
        platformer.getSubImage(resources.player, 0, 192, 80, 64),
        platformer.getSubImage(resources.player, 80, 192, 80, 64)
    ];
    platformer.textures.player.deadFalling = [
        platformer.getSubImage(resources.player, 0, 192, 80, 64)
    ];
    platformer.textures.player.bowAttack = [
        platformer.getSubImage(resources.player, 0, 256, 80, 64),
        platformer.getSubImage(resources.player, 80, 256, 80, 64),
        platformer.getSubImage(resources.player, 160, 256, 80, 64)
    ];
    platformer.textures.player.knifeAttack = [
        platformer.getSubImage(resources.player, 0, 128, 80, 64),
        platformer.getSubImage(resources.player, 80, 128, 80, 64),
        platformer.getSubImage(resources.player, 160, 128, 80, 64)
    ];
    platformer.textures.player.swordAttack = [
        platformer.getSubImage(resources.player, 0, 320, 80, 64),
        platformer.getSubImage(resources.player, 80, 320, 80, 64),
        platformer.getSubImage(resources.player, 160, 320, 80, 64),
        platformer.getSubImage(resources.player, 240, 320, 80, 64)
    ];



    platformer.textures.skeleton_knight = { };

    platformer.textures.skeleton_knight.jumping = [
        platformer.getSubImage(resources.skeleton_knight, 80, 0, 80, 64)
    ];
    platformer.textures.skeleton_knight.falling = [
        platformer.getSubImage(resources.skeleton_knight, 0, 0, 80, 64)
    ];
    platformer.textures.skeleton_knight.walking = [
        platformer.getSubImage(resources.skeleton_knight, 0, 64, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 80, 64, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 64, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 160, 64, 80, 64)
    ];
    platformer.textures.skeleton_knight.idle = [
        platformer.getSubImage(resources.skeleton_knight, 0, 0, 80, 64)
    ];
    platformer.textures.skeleton_knight.deadIdle = [
        platformer.getSubImage(resources.skeleton_knight, 0, 192, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 80, 192, 80, 64)
    ];
    platformer.textures.skeleton_knight.deadFalling = [
        platformer.getSubImage(resources.skeleton_knight, 0, 192, 80, 64)
    ];
    platformer.textures.skeleton_knight.bowAttack = [
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 80, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 160, 256, 80, 64)
    ];
    platformer.textures.skeleton_knight.swordAttack = [
        platformer.getSubImage(resources.skeleton_knight, 0, 320, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 80, 320, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 160, 320, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 240, 320, 80, 64)
    ];



    platformer.textures.skeleton_archer = { };

    platformer.textures.skeleton_archer.jumping = [
        platformer.getSubImage(resources.skeleton_archer, 80, 0, 80, 64)
    ];
    platformer.textures.skeleton_archer.falling = [
        platformer.getSubImage(resources.skeleton_archer, 0, 0, 80, 64)
    ];
    platformer.textures.skeleton_archer.walking = [
        platformer.getSubImage(resources.skeleton_archer, 0, 64, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 80, 64, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 0, 64, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 160, 64, 80, 64)
    ];
    platformer.textures.skeleton_archer.idle = [
        platformer.getSubImage(resources.skeleton_archer, 0, 0, 80, 64)
    ];
    platformer.textures.skeleton_archer.deadIdle = [
        platformer.getSubImage(resources.skeleton_archer, 0, 192, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 80, 192, 80, 64)
    ];
    platformer.textures.skeleton_archer.deadFalling = [
        platformer.getSubImage(resources.skeleton_archer, 0, 192, 80, 64)
    ];
    platformer.textures.skeleton_archer.bowAttack = [
        platformer.getSubImage(resources.skeleton_archer, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 80, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 160, 256, 80, 64)
    ];
    platformer.textures.skeleton_archer.swordAttack = [
        platformer.getSubImage(resources.skeleton_archer, 0, 320, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 80, 320, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 160, 320, 80, 64),
        platformer.getSubImage(resources.skeleton_archer, 240, 320, 80, 64)
    ];


    platformer.textures.items = { };

    platformer.textures.items.coin = [
        platformer.getSubImage(resources.tilemap, 0, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 0, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 0, 96, 32, 32)
    ];
    platformer.textures.items.ruby = [
        platformer.getSubImage(resources.tilemap, 0, 128, 32, 32),
        platformer.getSubImage(resources.tilemap, 0, 160, 32, 32),
        platformer.getSubImage(resources.tilemap, 0, 192, 32, 32),
        platformer.getSubImage(resources.tilemap, 0, 224, 32, 32)
    ];
    platformer.textures.items.strengthPotion = [
        platformer.getSubImage(resources.tilemap, 32, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 32, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 32, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 32, 128, 32, 32)
    ];
    platformer.textures.items.healthPotion = [
        platformer.getSubImage(resources.tilemap, 64, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 64, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 64, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 64, 128, 32, 32)
    ];
    platformer.textures.items.speedPotion = [
        platformer.getSubImage(resources.tilemap, 96, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 96, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 96, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 96, 128, 32, 32)
    ];
    platformer.textures.items.resistancePotion = [
        platformer.getSubImage(resources.tilemap, 128, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 128, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 128, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 128, 128, 32, 32)
    ];


    platformer.textures.items.sword = [
        platformer.getSubImage(resources.tilemap, 64, 160, 32, 32)
    ];
    platformer.textures.items.knife = [
        platformer.getSubImage(resources.tilemap, 32, 160, 32, 32)
    ];
    platformer.textures.items.bow = [
        platformer.getSubImage(resources.tilemap, 128, 160, 32, 32)
    ];
    platformer.textures.items.fireballSpell = [
        platformer.getSubImage(resources.tilemap, 160, 160, 32, 32)
    ];

    platformer.textures.items.arrowIdle = [
        platformer.getSubImage(resources.tilemap, 32, 192, 32, 32)
    ];
    platformer.textures.items.arrowMoving = [
        platformer.getSubImage(resources.tilemap, 32, 192, 32, 32),
        platformer.getSubImage(resources.tilemap, 64, 192, 32, 32)
    ];
    platformer.textures.items.knifeIdle = [
        platformer.getSubImage(resources.tilemap, 96, 192, 32, 32)
    ];
    platformer.textures.items.knifeMoving = [
        platformer.getSubImage(resources.tilemap, 96, 192, 32, 32)
    ];
    platformer.textures.items.fireBallMoving = [
        platformer.getSubImage(resources.tilemap, 128, 192, 32, 32),
        platformer.getSubImage(resources.tilemap, 160, 192, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 192, 32, 32)
    ];
}

platformer.initEffects = function(resources){
    platformer.textures.effects = { };
    platformer.textures.effects.fireBallExploding = [
        platformer.getSubImage(resources.tilemap, 224, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 256, 32, 32, 32)
    ];
}

platformer.initBackgrounds = function(resources){
    // backgrounds
    platformer.textures.background = platformer.getSubImage(resources.background, 0, 0, 1920, 1080);
}


platformer.initTiletypes = function(resources){
    // Tiletypes
    platformer.tiletype.void = new TileType('void', [
        platformer.getSubImage(resources.tilemap, 0, 128, 32, 32)
    ], false);
    platformer.tiletype.test = new TileType('test', [
        platformer.getSubImage(resources.tilemap, 0, 0, 32, 32)
    ], true);
    platformer.tiletype.stone = new TileType('stone', [
        platformer.getSubImage(resources.tilemap, 256, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 288, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 320, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 352, 64, 32, 32)
    ], true);
    platformer.tiletype.grassClump = new TileType('grassClump', [
        platformer.getSubImage(resources.tilemap, 352, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 384, 0, 32, 32)
    ], false);
    platformer.tiletype.dirt = new TileType('dirt', [
        platformer.getSubImage(resources.tilemap, 160, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 224, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 256, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 288, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 320, 32, 32, 32)
    ], true);
    platformer.tiletype.ground = new TileType('ground', [
        platformer.getSubImage(resources.tilemap, 128, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 160, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 0, 32, 32)
    ], true);
    platformer.tiletype.grass = new TileType('grass', [
        platformer.getSubImage(resources.tilemap, 256, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 288, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 320, 0, 32, 32)
    ], true);
    platformer.tiletype.spike = new TileType('spike', [
        platformer.getSubImage(resources.tilemap, 32, 0, 32, 32)
    ], false);
    platformer.tiletype.crate = new TileType('crate', [
        platformer.getSubImage(resources.tilemap, 64, 0, 32, 32)
    ], true);
    platformer.tiletype.brick = new TileType('brick', [
        platformer.getSubImage(resources.tilemap, 160, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 224, 64, 32, 32)
    ], true);
}

platformer.initWeapons = function(){
    // épée
    platformer.weapons.sword = new Weapon('sword', platformer.textures.items.sword, {
        damage : 7.5,
        knockback : 20,
        bleeding : 4,
        range : 50,
        delay : 400,
        projectile : false
    });
    // couteaux de lancé
    platformer.weapons.knife = new Weapon('knife', platformer.textures.items.knife, {
        damage : 5,
        knockback : 5,
        bleeding : 2.5,
        range : 200,
        delay : 400,
        projectile : true
    });
    // arc
    platformer.weapons.bow = new Weapon('bow', platformer.textures.items.bow, {
        damage : 10,
        knockback : 20,
        bleeding : 4,
        range : 225,
        delay : 1000,
        projectile : true
    });
    // fireball spell
    platformer.weapons.fireballSpell = new Weapon('fireBallSpell', platformer.textures.items.fireballSpell, {
        damage : 10,
        knockback : 25,
        bleeding : 6,
        range : 250,
        delay : 1750,
        projectile : true
    });

}
