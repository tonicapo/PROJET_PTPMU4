window.addEventListener('DOMContentLoaded', function(){
    var gameID = 'bloodAndGuts';

    platformer.init(gameID, gameReady, {
        title : 'Blood & Guts',
        debug : true,

        width : 1440,
        height : 700,

        fullscreen : false,

        seed : 'caca',

        font : 'silkscreen'
    });

    function gameReady(){
        var gameWrapper = document.getElementById(gameID);
        centerRelativeToScreen(gameWrapper);

        window.addEventListener('resize', function(){
            centerRelativeToScreen(gameWrapper);
        });
    }

    // permet de centrer un élément sur le viewport
    function centerRelativeToScreen(target){
        target.style.marginTop = ((window.innerHeight - parseInt(target.style.height, 10)) / 2) + 'px';
        target.style.marginLeft = ((window.innerWidth - parseInt(target.style.width, 10)) / 2) + 'px';
    }
});
