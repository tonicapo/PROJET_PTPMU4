'use strict';

var platformer = platformer || {};



platformer.init = function(){
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
        'Init.js',
        'Game.js',
        'misc/seedrandom.js',
        'misc/utility.js',
        'misc/Animation.js',
        'misc/ArrayList.js',
        'misc/Timer.js',
        'gamestates/GameStateHandler.js',
        'gamestates/LevelState.js',
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
        'objects/loot/Loot.js',
        'objects/loot/Potion.js',
        'objects/loot/Coin.js',
        'objects/Crate.js',
        'objects/effects/Effect.js'
    ];

    // file d'attente de fichiers à charger
    for(var i = 0, n = files.length; i < n; i++){
        assets.push({ name : undefined, type : 'script', path : SCRIPTS_PATH + files[i], options : { asynchronous : true } });
    }
    assets.push({ name : 'tilemap', type : 'image', path : IMAGES_PATH + 'tilemap.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'player', type : 'image', path : IMAGES_PATH + 'player.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'skeleton_knight', type : 'image', path : IMAGES_PATH + 'skeleton_knight.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'skeleton_archer', type : 'image', path : IMAGES_PATH + 'skeleton_archer.png', options : { width : 480, height : 480 } });
    assets.push({ name : 'background', type : 'image', path : IMAGES_PATH + 'background.png', options : { width : 1920, height : 1080 } });

    // Activer / désactiver l'affichage des informations de debug
    platformer.debug = true;


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


    // Dimension de la canvas
    platformer.dimension = { w : 1024, h : 600 };

    // Fonts
    platformer.font = { normal : 'silkscreen' };


    platformer.scale = 2;

    platformer.tileSizeX = 32 * platformer.scale;
    platformer.tileSizeY = 32 * platformer.scale;

    platformer.seed;

    platformer.sounds;
    platformer.textures = { };

    // Liste des touches
    platformer.keylist = platformer.getKeyList();

    platformer.tiletype = { };

    platformer.weapons = { };

    platformer.events = { };

    console.time('ASSETS_LOAD_TIME');
    /**
    * Chargement des ressources du jeu
    */

    platformer.loadAssets(assets, function(resources){
        console.timeEnd('ASSETS_LOAD_TIME');

        platformer.initTextures(resources);
        platformer.initEffects(resources);
        platformer.initBackgrounds(resources);
        platformer.initTiletypes(resources);
        platformer.initWeapons();

        platformer.game = new Game;
        platformer.game.init();
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
