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

var assets = [
    { name : undefined, type : 'script', path : SCRIPTS_PATH + 'seedrandom.js', options : { asynchronous : true } },
    { name : undefined, type : 'script', path : SCRIPTS_PATH + 'utility.js', options : { asynchronous : true } },
    { name : undefined, type : 'script', path : SCRIPTS_PATH + 'Game.js', options : { asynchronous : true } },
    { name : undefined, type : 'script', path : SCRIPTS_PATH + 'gamestates/GameStateHandler.js', options : { asynchronous : true } },
    { name : undefined, type : 'script', path : SCRIPTS_PATH + 'gamestates/LevelState.js', options : { asynchronous : true } },
    { name : undefined, type : 'script', path : SCRIPTS_PATH + 'world/Rectangle.js', options : { asynchronous : true } },

    { name : 'tilemap', type : 'image', path : IMAGES_PATH + 'tilemap.png', options : { width : 320, height : 320 } }
];

// Activer / désactiver l'affichage des informations de debug
platformer.debug = true;

// Dimension de la canvas
platformer.dimension = {
    w : 800,
    h : 500
};

// Fonts
platformer.font = {
    normal : 'silkscreen'
};


platformer.scale = 1;

platformer.tileSizeX = 32;
platformer.tileSizeY = 32;

platformer.seed;

platformer.sounds;
platformer.textures;

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


window.addEventListener('DOMContentLoaded', function(){
    /**
    * Load resources
    */
    console.time('ASSETS_LOAD_TIME');

    platformer.loadAssets(assets, function(resources){
        console.timeEnd('ASSETS_LOAD_TIME');

        /**
        * Textures
        */
        platformer.textures = {
            test1 : [ platformer.getSubImage(resources.tilemap, 0, 0, 32, 32) ],
            test2 : [ platformer.getSubImage(resources.tilemap, 32, 0, 32, 32) ]
        };

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
