/**
    TODO:
    Animations :
    - boss (mort / attaque)
    - fond menu
    - titre du jeu
    - variantes de caisses
    - boule de feu
    - effets de potion / boule de feu
    - animation victoire player ???

    Génération de map :
    - fin de niveau (passage dans une certaine zone)
    - ajouter random boss sur le niveau

    Gameplay :
    - difficulté (facile, moyen, difficile)

    Interface :
    - menu et options
    - changement des touches
    - sélection de la difficulté

    BackEnd :
    - envoyer les stats
    - se logger
*/

window.addEventListener('DOMContentLoaded', function(){

    var gameID = 'bloodAndGuts';

    // le conteneur du jeu
    var gameWrapper = document.createElement('div');
    gameWrapper.setAttribute('id', gameID);
    gameWrapper.style.position = 'relative';
    document.body.appendChild(gameWrapper);


    platformer.init(gameID, {
        title : 'Blood & Guts',
        debug : true,

        width : 1440,
        height : 700,

        fullscreen : false,

        seed : undefined,

        font : 'silkscreen',

        onready : gameReady,
        onresize : gameResize
    });

    function gameReady(){

    }

    function gameResize(width, height){
        // mobile & tablet & support plus petits
        if(window.innerWidth < width || window.innerHeight < height){
            platformer.game.fullscreen();
        }

        // centrage sur l'écran pour le mode fenêtré
        if(!platformer.fullscreen){
            centerRelativeToScreen(gameWrapper);
        }
        else{
            gameWrapper.style.marginTop = 0;
            gameWrapper.style.marginLeft = 0;
        }
    }

    // permet de centrer un élément sur le viewport
    function centerRelativeToScreen(target){
        if(typeof target === 'undefined'){
            return false;
        }
        target.style.marginTop = ((window.innerHeight - parseInt(target.style.height, 10)) / 2) + 'px';
        target.style.marginLeft = ((window.innerWidth - parseInt(target.style.width, 10)) / 2) + 'px';
    }
});
