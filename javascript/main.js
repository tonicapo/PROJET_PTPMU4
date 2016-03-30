/****
* Personnalisation du jeu
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
        debug : false,

        width : 1378 ,
        height : 700,

        resizeable : true,
        fullscreen : false,

        seed : undefined,
        scale : 2,

        font : 'Minecraftia-Regular',

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
