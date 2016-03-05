'use strict';

var platformer = platformer || {};

/**
* Sert à inclure un fichier dans le document
* path - Le chemin vers le fichier
* callback - Fonction exécutée une fois le fichier chargé
*/
platformer.include = function(path, tmp){
    var tmp = tmp || {};
    var callback = tmp.callback || undefined;
    var required = tmp.required || true;


    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', path, false);
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
        else{
            if(required){
                throw new Error('Impossible de charger le fichier ' + path);
            }
        }
    }

    xhttp.send();
}

/**
* Permet d'afficher des messages dans la console seulement en mode débug
*/
platformer.notify = function(message){
    if(platformer.debug){
        console.info(message);
    }
}

platformer.debug = true;

/**
* Dimension de la canvas
*/
platformer.dimension = {
    w : 800,
    h : 500
};

/**
* Liste des touches
*/
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
}

/**
* Dépendances
*/
platformer.include('./platformer/javascript/seedrandom.js');
platformer.include('./platformer/javascript/Game.js');
platformer.include('./platformer/javascript/gamestates/GameStateHandler.js');
platformer.include('./platformer/javascript/gamestates/LevelState.js');



platformer.game = new Game;
platformer.game.init();
