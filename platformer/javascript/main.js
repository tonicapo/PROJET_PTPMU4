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

    function gameResize(){
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
