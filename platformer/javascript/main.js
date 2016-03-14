var platformer = platformer || {};

/**
* Dépendances : fichiers à inclure au chargement de la page
* - Type : image | script | sound
* - Path : chemin vers le fichier
* - Options
*/
var SCRIPTS_PATH = './platformer/javascript/';
var IMAGES_PATH = './platformer/resources/images/';
var SOUNDS_PATH = './platformer/resources/sounds/';

var assets = [];
var files = [
    'seedrandom.js',
    'utility.js',
    'Game.js',
    'Animation.js',
    'ArrayList.js',
    'Timer.js',
    'gamestates/GameStateHandler.js',
    'gamestates/LevelState.js',
    'world/Position.js',
    'world/Rectangle.js',
    'world/Map.js',
    'world/WorldGeneration.js',
    'world/Tile.js',
    'world/TileType.js',
    'entities/Entity.js',
    'entities/Player.js',
    'entities/Hostile.js',
    'entities/AI_Entity.js',
    'entities/Enemy.js',
    'objects/MapObject.js',
    'objects/particles/Particle.js',
    'objects/particles/Blood.js',
    'objects/items/Weapon.js',
    'objects/projectiles/Projectile.js',
    'objects/projectiles/Arrow.js',
    'objects/projectiles/Knife.js',
    'objects/projectiles/FireBall.js',
    'objects/loot/Loot.js',
    'objects/loot/Potion.js',
    'objects/loot/Coin.js',
    'objects/Crate.js'
];

for(var i = 0, n = files.length; i < n; i++){
    assets.push({ name : undefined, type : 'script', path : SCRIPTS_PATH + files[i], options : { asynchronous : true } });
}
assets.push({ name : 'tilemap', type : 'image', path : IMAGES_PATH + 'tilemap.png', options : { width : 480, height : 480 } });
assets.push({ name : 'player', type : 'image', path : IMAGES_PATH + 'player.png', options : { width : 480, height : 480 } });
assets.push({ name : 'gui', type : 'image', path : IMAGES_PATH + 'gui.png', options : { width : 480, height : 480 } });


// Activer / désactiver l'affichage des informations de debug
platformer.debug = true;


// Dimension de la canvas
platformer.dimension = {
    w : 1000,
    h : 500
};

// Fonts
platformer.font = {
    normal : 'silkscreen'
};


platformer.scale = 2;

platformer.tileSizeX = 32 * platformer.scale;
platformer.tileSizeY = 32 * platformer.scale;

platformer.seed;

platformer.sounds;
platformer.textures = {};

// Liste des touches
platformer.keylist = {
    mvt_up : 38,
    mvt_down : 40,
    mvt_left : 37,
    mvt_right : 39,
    action_attack : 32,
    toggle_menu : 77,
    toggle_fullscreen : 70,
    toggle_restart : 82,
    toggle_pause : 27
};

platformer.tiletype = {};
platformer.material = {};

platformer.weapons = {};

window.addEventListener('DOMContentLoaded', function(){
    /**
    * Load resources
    */
    console.time('ASSETS_LOAD_TIME');

    platformer.loadAssets(assets, function(resources){
        console.timeEnd('ASSETS_LOAD_TIME');

        // textures
        platformer.textures.entity = [ platformer.getSubImage(resources.player, 0, 384, 64, 64) ];

        platformer.textures.player = {};
        platformer.textures.player.jumping = [ platformer.getSubImage(resources.player, 80, 0, 80, 64) ];
        platformer.textures.player.doubleJumping = [ platformer.getSubImage(resources.player, 0, 0, 80, 64), platformer.getSubImage(resources.player, 80, 0, 80, 64) ];
        platformer.textures.player.falling = [ platformer.getSubImage(resources.player, 0, 0, 80, 64) ];
        platformer.textures.player.walking = [ platformer.getSubImage(resources.player, 0, 64, 80, 64), platformer.getSubImage(resources.player, 80, 64, 80, 64), platformer.getSubImage(resources.player, 0, 64, 80, 64), platformer.getSubImage(resources.player, 160, 64, 80, 64) ];
        platformer.textures.player.idle = [ platformer.getSubImage(resources.player, 0, 0, 80, 64) ];
        platformer.textures.player.deadIdle = [ platformer.getSubImage(resources.player, 0, 192, 80, 64), platformer.getSubImage(resources.player, 80, 192, 80, 64) ];
        platformer.textures.player.deadFalling = [ platformer.getSubImage(resources.player, 0, 192, 80, 64) ];
        platformer.textures.player.bowAttack = [ platformer.getSubImage(resources.player, 0, 256, 80, 64), platformer.getSubImage(resources.player, 80, 256, 80, 64), platformer.getSubImage(resources.player, 160, 256, 80, 64) ];
        platformer.textures.player.knifeAttack = [ platformer.getSubImage(resources.player, 0, 128, 80, 64), platformer.getSubImage(resources.player, 80, 128, 80, 64), platformer.getSubImage(resources.player, 160, 128, 80, 64) ];
        platformer.textures.player.swordAttack = [ platformer.getSubImage(resources.player, 0, 320, 80, 64), platformer.getSubImage(resources.player, 80, 320, 80, 64), platformer.getSubImage(resources.player, 160, 320, 80, 64), platformer.getSubImage(resources.player, 240, 320, 80, 64) ];

        platformer.textures.items = {};
        platformer.textures.items.coin = [ platformer.getSubImage(resources.tilemap, 0, 32, 32, 32) ];
        platformer.textures.items.potions = [ platformer.getSubImage(resources.tilemap, 32, 32, 32, 32), platformer.getSubImage(resources.tilemap, 64, 32, 32, 32), platformer.getSubImage(resources.tilemap, 96, 32, 32, 32), platformer.getSubImage(resources.tilemap, 128, 32, 32, 32) ];
        platformer.textures.items.sword = [ platformer.getSubImage(resources.gui, 0, 0, 32, 32) ];
        platformer.textures.items.knife = [ platformer.getSubImage(resources.gui, 64, 0, 32, 32) ];
        platformer.textures.items.bow = [ platformer.getSubImage(resources.gui, 128, 0, 32, 32) ];
        platformer.textures.items.fireballSpell = [ platformer.getSubImage(resources.gui, 160, 0, 32, 32) ];

        platformer.textures.items.arrowIdle = [ platformer.getSubImage(resources.gui, 0, 32, 32, 32) ];
        platformer.textures.items.arrowMoving = [ platformer.getSubImage(resources.gui, 0, 32, 32, 32), platformer.getSubImage(resources.gui, 32, 32, 32, 32) ];
        platformer.textures.items.knifeIdle = [ platformer.getSubImage(resources.gui, 64, 32, 32, 32) ];
        platformer.textures.items.knifeMoving = [ platformer.getSubImage(resources.gui, 64, 32, 32, 32) ];
        platformer.textures.items.fireBallMoving = [ platformer.getSubImage(resources.gui, 96, 32, 32, 32), platformer.getSubImage(resources.gui, 128, 32, 32, 32), platformer.getSubImage(resources.gui, 160, 32, 32, 32) ];
        platformer.textures.items.fireBallExploding = [ platformer.getSubImage(resources.gui, 192, 32, 32, 32), platformer.getSubImage(resources.gui, 224, 32, 32, 32) ];

        // Tiletypes
        platformer.tiletype.void = new TileType('void', [ platformer.getSubImage(resources.tilemap, 80, 0, 32, 32) ], false);
        platformer.tiletype.test = new TileType('test', [ platformer.getSubImage(resources.tilemap, 0, 0, 32, 32) ], true);
        platformer.tiletype.spike = new TileType('spike', [ platformer.getSubImage(resources.tilemap, 32, 0, 32, 32) ], false);
        platformer.tiletype.crate = new TileType('crate', [ platformer.getSubImage(resources.tilemap, 64, 0, 32, 32) ], true);

        // épée
        platformer.weapons.sword = new Weapon('sword', platformer.textures.items.sword, {
            damage : 7.5,
            knockback : 10,
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
            delay : 200,
            projectile : true
        });
        // arc
        platformer.weapons.bow = new Weapon('bow', platformer.textures.items.bow, {
            damage : 10,
            knockback : 15,
            bleeding : 4,
            range : 300,
            delay : 1250,
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


        platformer.game = new Game;
        platformer.game.init();
    });
});


/**
* Permet d'afficher des messages dans la console seulement en mode débug
*/
platformer.notify = function(message){
    if(platformer.debug){
        console.info(message);
    }
}
