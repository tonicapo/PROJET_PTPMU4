'use strict';

var platformer = platformer || {};

platformer.init = function(id, options){
    platformer.id = id;
    // Activer / désactiver l'affichage des informations de debug
    platformer.debug = (typeof options.debug !== 'undefined') ? options.debug: true;

    // l'utilisateur peut redimensionner le jeu lui même
    platformer.resizeable = (typeof options.resizeable !== 'undefined') ? options.resizeable: true;

    // Dimension de la canvas
    platformer.dimension = { };
    platformer.dimension.w = (typeof options.width !== 'undefined') ? options.width : 1200;
    platformer.dimension.h = (typeof options.height !== 'undefined') ? options.height : 800;

    platformer.scale = (typeof options.scale !== 'undefined') ? options.scale : 2;
    platformer.fullscreen = (typeof options.fullscreen !== 'undefined') ? options.fullscreen : false;

    platformer.seed = (typeof options.seed !== 'undefined') ? options.seed : undefined;

    platformer.title = (typeof options.title !== 'undefined') ? options.title : '';

    // évènement notifiant que le conteneur du jeu est prêt
    platformer.onready = (typeof options.onready === 'function') ? options.onready : undefined;
    // évènement déclenché au moment où le jeu est redimensionné
    platformer.onresize = (typeof options.onresize === 'function') ? options.onresize : undefined;

    // Font
    platformer.font = (typeof options.font !== 'undefined') ? options.font : 'Arial';

    // Touches par défaut
    platformer.defaultKeyList = {
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

    // niveau de difficulté
    platformer.mode = { };
    platformer.difficulty;

    // Liste des touches a utiliser
    platformer.keylist = platformer.getKeyList();

    // Dimension des blocks
    platformer.tileSizeX = 32 * platformer.scale;
    platformer.tileSizeY = 32 * platformer.scale;

    // Ressources du jeu
    platformer.sounds = { };
    platformer.textures = { };

    platformer.tiletype = { };

    platformer.weapons = { };

    platformer.events = { };



    /**
    * Chargement des ressources du jeu
    */
    if(platformer.debug) console.time('ASSETS_LOAD_TIME');

    platformer.loadAssets(platformer.getAssets(), function(resources){
        if(platformer.debug) console.timeEnd('ASSETS_LOAD_TIME');

        platformer.initTextures(resources);
        platformer.initBackgrounds(resources);
        platformer.initTiletypes(resources);
        platformer.initModes();

        if(typeof platformer.difficulty === 'undefined'){
            platformer.difficulty = platformer.mode['normal'];
        }

        platformer.game = new Game;
        platformer.game.init();

        if(typeof platformer.onready === 'function'){
            platformer.onready();
        }
    });
}


/**
* Récupère une liste d'images et de sons
*/
platformer.loadAssets = function(files, callback){
    if(!Array.isArray(files)){
        files = [files];
    }

    var list = {};
    var index = files.length;

    for(var i = 0, n = files.length; i < n; i++){
        var file = files[i];

        if(file != undefined && file.type != undefined){
            var method = undefined;

            if(file.type == 'image'){
                method = platformer.loadSpritesheet;
            }
            else if(file.type == 'sound'){
                method = platformer.loadSound;
            }
            else if(file.type == 'script'){
                method = platformer.loadScript;
            }

            if(method != undefined){
                method(file.name, file.path, file.options, function(name, item){
                    handler(name, item);
                });
            }
            else{
                throw 'Undefined method';
            }
        }
    }

    function handler(name, item){
        if(name != undefined) list[name] = item;
        index--;

        if(index == 0){
            if(typeof callback === 'function'){
                callback(list);
            }
        }
    }
}

/*
* Permet de récupérer une image sur une spritesheet
*/
platformer.getSubImage = function(spritesheet, x, y, width, height){
    if(typeof spritesheet === 'undefined'){
        throw 'Could not read from spritesheet';
    }

    var canvas, ctx, data, img;

    canvas = platformer.createCanvas(width, height);
    ctx = canvas.getContext('2d');

    data = spritesheet.getImageData(x, y, width, height);
    ctx.putImageData(data, 0, 0);

    img = new Image;
    img.src = canvas.toDataURL('image/png', 1);

    return img;
}

/**
* Charge une image et retourne le contexte de la canvas où on a dessiné l'image
*/
platformer.loadSpritesheet = function(name, filepath, options, callback){
    var canvas, context, img;
    var width = options.width || 0;
    var height = options.height || 0;

    canvas = platformer.createCanvas(width, height);
    context = canvas.getContext('2d');

    img = new Image;
    img.onload = function(){
        context.drawImage(img, 0, 0, width, height);

        if(typeof callback === 'function'){
            callback(name, context);
        }
    }
    img.src = filepath;
}

/**
* Charge un fichier de son
*/
platformer.loadSound = function(name, filepath, options, callback){

}

/**
* Sert à inclure un ou plusieurs fichiers avec un callback une fois terminé
*/
/**
* Sert à inclure un fichier dans le document
* filepath - Le chemin vers le fichier
* callback - Fonction exécutée une fois le fichier chargé
*/
platformer.loadScript = function(name, filepath, options, callback){
    var required = options.required || false;
    var asynchronous = options.asynchronous || false;

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', filepath, asynchronous);
    xhttp.setRequestHeader('Content-type', 'application/javascript');

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == 4 && xhttp.status == 200){
            // ajout au document
            var script = document.createElement('script');
            script.innerHTML = xhttp.responseText;

            document.body.appendChild(script);

            if(typeof callback === 'function'){
                callback();
            }
        }
        else if(xhttp.status == 404){
            if(required){
                throw new Error('Impossible de trouver le fichier ' + filepath);
            }
        }
    }

    xhttp.send();
}



/*
* Permet de créer une canvas
*/
platformer.createCanvas = function(width, height){
    var canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    return canvas;
}


/**
* Permet d'afficher des messages dans la console seulement en mode débug
*/
platformer.notify = function(message){
    if(platformer.debug){
        console.info(message);
    }
}

// récupère la liste des touches du clavier sauvegardée ou par défaut si elle n'existe pas encore
platformer.getKeyList = function(){
    var savedKeys = platformer.getRegisteredKeyList();
    var defaultKeys = platformer.defaultKeyList;

    var keyList = { };

    if(typeof savedKeys !== 'object' || savedKeys == null){
        savedKeys = { };
    }

    for(var i in defaultKeys){
        keyList[i] = (typeof savedKeys[i] !== 'undefined') ? parseInt(savedKeys[i], 10) : defaultKeys[i];
    }

    return keyList;
}

// permet d'enregistrer la liste courante des touches
platformer.registerKeyList = function(){
    localStorage.setItem('platformer_keylist', JSON.stringify(platformer.keylist));
}

// permet de récupérer les touches enregistrées dans le local storage
platformer.getRegisteredKeyList = function(){
    return JSON.parse(localStorage.getItem('platformer_keylist'));
}



platformer.getAssets = function(){
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
        'Game.js',
        'misc/seedrandom.js',
        'misc/utility.js',
        'misc/Animation.js',
        'misc/ArrayList.js',
        'misc/Timer.js',
        'gamestates/GameStateHandler.js',
        'gamestates/LevelState.js',
        'gamestates/MenuState.js',
        'world/Position.js',
        'world/Rectangle.js',
        'world/Background.js',
        'world/Map.js',
        'world/WorldGeneration.js',
        'world/Tile.js',
        'world/TileType.js',
        'entities/Entity.js',
        'entities/Player.js',
        'entities/AI_Entity.js',
        'entities/Enemy.js',
        'entities/Boss.js',
        'objects/AnimatedObject.js',
        'objects/MapObject.js',
        'objects/particles/Particle.js',
        'objects/particles/Blood.js',
        'objects/particles/Bone.js',
        'objects/items/Weapon.js',
        'objects/projectiles/Projectile.js',
        'objects/projectiles/Arrow.js',
        'objects/projectiles/Knife.js',
        'objects/projectiles/FireBall.js',
        'objects/items/Loot.js',
        'objects/items/Potion.js',
        'objects/items/Coin.js',
        'objects/Crate.js'
    ];

    // file d'attente de fichiers à charger
    for(var i = 0, n = files.length; i < n; i++){
        assets.push({ name : undefined, type : 'script', path : SCRIPTS_PATH + files[i], options : { asynchronous : true } });
    }
    assets.push({ name : 'tilemap', type : 'image', path : IMAGES_PATH + 'tilemap.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'player', type : 'image', path : IMAGES_PATH + 'player.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'boss', type : 'image', path : IMAGES_PATH + 'boss.png', options : { width : 244, height : 488 } });
    assets.push({ name : 'skeleton_knight', type : 'image', path : IMAGES_PATH + 'skeleton_knight.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'skeleton_archer', type : 'image', path : IMAGES_PATH + 'skeleton_archer.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'background', type : 'image', path : IMAGES_PATH + 'background.png', options : { width : 1920, height : 1080 } });
    assets.push({ name : 'logo', type : 'image', path : IMAGES_PATH + 'logo.png', options : { width : 355, height : 122 } });

    return assets;
}


platformer.initTextures = function(resources){
    // textures
    platformer.textures.gui = { };
    platformer.textures.gui.healthbar = platformer.getSubImage(resources.tilemap, 0, 256, 192, 46);
    platformer.textures.gui.arrows = [
        platformer.getSubImage(resources.tilemap, 256, 128, 11, 6),
        platformer.getSubImage(resources.tilemap, 256 + 11, 128, 11, 6),
        platformer.getSubImage(resources.tilemap, 256 + 11 + 11, 128, 6, 11),
        platformer.getSubImage(resources.tilemap, 256 + 11 + 11 + 6, 128, 6, 11)
    ];

    platformer.textures.entity = { };
    platformer.textures.player = { };

    platformer.textures.player.jumping = [
        platformer.getSubImage(resources.player, 80, 0, 80, 64)
    ];
    platformer.textures.player.victory = [
        platformer.getSubImage(resources.player, 0, 384, 80, 64)
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
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
        platformer.getSubImage(resources.skeleton_knight, 0, 256, 80, 64),
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


    platformer.textures.boss = { };

    platformer.textures.boss.idle = [
        platformer.getSubImage(resources.boss, 0, 0, 122, 122)
    ];
    platformer.textures.boss.fireBallAttack = [
        platformer.getSubImage(resources.boss, 122, 0, 122, 122)
    ];
    platformer.textures.boss.falling = [
        platformer.getSubImage(resources.boss, 0, 0, 122, 122)
    ];
    platformer.textures.boss.deadIdle = [
        platformer.getSubImage(resources.boss, 0, 366, 122, 122),
        platformer.getSubImage(resources.boss, 122, 366, 122, 122)
    ];
    platformer.textures.boss.deadFalling = [
        platformer.getSubImage(resources.boss, 0, 366, 122, 122)
    ];
    platformer.textures.boss.walking = [
        platformer.getSubImage(resources.boss, 122 * 0, 122 * 2, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 1, 122 * 2, 122, 122)
    ];
    platformer.textures.boss.laughing = [
        platformer.getSubImage(resources.boss, 122 * 0, 122 * 1, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 1, 122 * 1, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 0, 122 * 1, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 1, 122 * 1, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 0, 122 * 1, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 1, 122 * 1, 122, 122)
    ];
    platformer.textures.boss.bossFeet = [
        platformer.getSubImage(resources.boss, 0, 0, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 0, 122 * 2, 122, 122),
        platformer.getSubImage(resources.boss, 122 * 1, 122 * 2, 122, 122),
        platformer.getSubImage(resources.boss, 0, 0, 122, 122)
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
    platformer.textures.items.saphir = [
        platformer.getSubImage(resources.tilemap, 192, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 128, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 160, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 192, 32, 32)
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
    platformer.textures.items.fireBallSpell = [
        platformer.getSubImage(resources.tilemap, 0, 0, 32, 32)
    ];
    platformer.textures.items.bossFeet = [
        platformer.getSubImage(resources.tilemap, 0, 0, 32, 32)
    ];

    platformer.textures.items.arrowIdle = [
        platformer.getSubImage(resources.tilemap, 128, 192, 32, 32)
    ];
    platformer.textures.items.arrowMoving = [
        platformer.getSubImage(resources.tilemap, 32, 192, 32, 32),
        platformer.getSubImage(resources.tilemap, 64, 192, 32, 32)
    ];
    platformer.textures.items.knifeIdle = [
        platformer.getSubImage(resources.tilemap, 160, 192, 32, 32)
    ];
    platformer.textures.items.knifeMoving = [
        platformer.getSubImage(resources.tilemap, 96, 192, 32, 32)
    ];
    platformer.textures.items.fireBallMoving = [
        platformer.getSubImage(resources.tilemap, 32, 224, 32, 32),
        platformer.getSubImage(resources.tilemap, 64, 224, 32, 32),
        platformer.getSubImage(resources.tilemap, 96, 224, 32, 32),
        platformer.getSubImage(resources.tilemap, 128, 224, 32, 32),
        platformer.getSubImage(resources.tilemap, 160, 224, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 224, 32, 32)
    ];
    platformer.textures.items.fireBallIdle = [
        platformer.getSubImage(resources.tilemap, 224, 224, 32, 32),
        platformer.getSubImage(resources.tilemap, 256, 224, 32, 32)
    ];
}

platformer.initBackgrounds = function(resources){
    // backgrounds
    platformer.textures.background = platformer.getSubImage(resources.background, 0, 0, 1920, 1080);
    platformer.textures.logo = platformer.getSubImage(resources.logo, 0, 0, 355, 122);
}


platformer.initTiletypes = function(resources){
    // Tiletypes
    platformer.tiletype.void = new TileType('void', [
        platformer.getSubImage(resources.tilemap, 0, 128, 32, 32)
    ], false);
    platformer.tiletype.test = new TileType('test', [
        platformer.getSubImage(resources.tilemap, 0, 0, 32, 32)
    ], true);
    platformer.tiletype.door = new TileType('door', [
        platformer.getSubImage(resources.tilemap, 224, 128, 32, 32),
        platformer.getSubImage(resources.tilemap, 224, 96, 32, 32)
    ], true, false);
    platformer.tiletype.chest = new TileType('chest', [
        platformer.getSubImage(resources.tilemap, 224, 160, 32, 32)
    ], false, false);
    platformer.tiletype.stone = new TileType('stone', [
        platformer.getSubImage(resources.tilemap, 256, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 288, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 320, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 352, 64, 32, 32)
    ], true);
    platformer.tiletype.grassClump = new TileType('grassClump', [
        platformer.getSubImage(resources.tilemap, 352, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 384, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 416, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 448, 0, 32, 32)
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
    platformer.tiletype.grassEdge = new TileType('grassEdge', [
        platformer.getSubImage(resources.tilemap, 352, 32, 32, 32),
        platformer.getSubImage(resources.tilemap, 384, 32, 32, 32)
    ], false, false);
    platformer.tiletype.spike = new TileType('spike', [
        platformer.getSubImage(resources.tilemap, 160, 96, 32, 32)
    ], false);
    platformer.tiletype.crate = new TileType('crate', [
        platformer.getSubImage(resources.tilemap, 64, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 32, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 96, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 128, 0, 32, 32),
        platformer.getSubImage(resources.tilemap, 256, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 288, 96, 32, 32)
    ], true);
    platformer.tiletype.brick = new TileType('brick', [
        platformer.getSubImage(resources.tilemap, 160, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 192, 64, 32, 32),
        platformer.getSubImage(resources.tilemap, 224, 64, 32, 32)
    ], true);
    /*
    platformer.tiletype.brickUnder = new TileType('brickUnder', [
        platformer.getSubImage(resources.tilemap, 256, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 288, 96, 32, 32),
        platformer.getSubImage(resources.tilemap, 300, 96, 32, 32)
    ], true);
    */
}


platformer.initModes = function(){
    platformer.mode.peaceful = {
        name : 'Paisible',
        text : [
            'PAISIBLE : Récupérer votre coffre sans risque d\'être troublé...',
            'Ce mode n\'offre aucune récompense en chemin.'
        ],
        killAllMobsToComplete : false,

        numCols : 100,
        numRows : 20,

        crateSpawnChance : 0,
        hostileSpawnRate : 0,
        coinBridgeSpawnChance : 0,
        bonusChestSpawnChance : 0,

        archerSpawnChance : 0,
        bossSpawnChance : 0,
        healthRatio : 1
    };
    platformer.mode.easy = {
        name : 'Facile',
        text : [
            'FACILE : Votre or a été dérobé par des créatures maléfiques.',
            'Vous devez récupérer un maximum de pièces, et retrouver votre coffre...'
        ],
        killAllMobsToComplete : false,

        numCols : 100,
        numRows : 20,

        crateSpawnChance : 0.1,
        hostileSpawnRate : 0.1,
        coinBridgeSpawnChance : 0.75,
        bonusChestSpawnChance : 0.4,

        archerSpawnChance : 0.2,
        bossSpawnChance : 0,
        healthRatio : 1
    };
    platformer.mode.normal = {
        name : 'Normal',
        text : [
            'NORMAL : Votre or a été dérobé par des créatures maléfiques.',
            'Vous devez récupérer un maximum de pièces, éliminer TOUS les voleurs, et retrouver votre coffre...'
        ],
        killAllMobsToComplete : true,

        numCols : 175,
        numRows : 20,

        crateSpawnChance : 0.1,
        hostileSpawnRate : 0.16,
        coinBridgeSpawnChance : 0.75,
        bonusChestSpawnChance : 0.4,

        archerSpawnChance : 0.3,
        bossSpawnChance : 0.1,
        healthRatio : 1
    };
    platformer.mode.hard = {
        name : 'Difficile',
        text : [
            'DIFFICILE : Votre or a été dérobé par des créatures maléfiques.',
            'Vous devez récupérer un maximum de pièces, éliminer TOUS les voleurs, et retrouver votre coffre...',
            'Ce mode offre le plus d\'opportunités de trouver de l\'or. Pour les plus expérimentés.'
        ],
        killAllMobsToComplete : true,

        numCols : 275,
        numRows : 20,

        crateSpawnChance : 0.1,
        hostileSpawnRate : 0.2,
        coinBridgeSpawnChance : 0.8,
        bonusChestSpawnChance : 0.5,

        archerSpawnChance : 0.4,
        bossSpawnChance : 0.15,
        healthRatio : 1.5
    };
}
