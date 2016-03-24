window.addEventListener('DOMContentLoaded', function(){
    var gameID = 'bloodAndGuts';
    var gameWrapper;

    platformer.init(gameID, {
        title : 'Blood & Guts',
        debug : true,

        width : 1440,
        height : 700,

        fullscreen : false,

        seed : 'caca',

        font : 'silkscreen',

        onready : gameReady,
        onresize : gameResize
    });

    function gameReady(){
        gameWrapper = document.getElementById(gameID);
    }

    function gameResize(width, height){
        // mobile & tablet & support plus petits
        if(window.innerWidth < width || window.innerHeight < height){
            platformer.game.fullscreen();
            console.log(width, height, window.innerWidth);
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
