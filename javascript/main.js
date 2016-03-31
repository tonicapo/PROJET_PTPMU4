var playerData;
var gameStarted = false;
var gameID = 'bloodAndGuts';
var gameWrapper;

var loginForm;
var registerForm;

var platformer = platformer || { };

window.addEventListener('DOMContentLoaded', function(){
    gameWrapper = document.getElementById(gameID);

    /** Initialisation **/
    initForms();

    window.addEventListener('playerLogged', function(e){
        if(!gameStarted){
            platformer.init(gameID, {
                title : 'Blood & Guts',
                debug : false,

                infos : e.detail['infos'],

                width : 1280 ,
                height : 700,

                resizeable : true,
                fullscreen : false,

                seed : undefined,
                scale : 2,

                font : 'Minecraftia-Regular',

                onresize : gameResize,
                onplayerdeath : gamePlayerDeath,
                onlevelcomplete : gameLevelComplete
            });



            gameStarted = true;
        }
    });


    function initForms(){
        loginForm = document.getElementById('login');
        registerForm = document.getElementById('register');

        loginForm.addEventListener('submit', function(e){
            e.preventDefault();
            submitForm(loginForm, function(data, xhttp){
                clearMessages(loginForm);
                showMessages(loginForm, data['notifications']);

                if(data['status'] == 1){
                    hide(loginForm);
                    hide(registerForm);
                    hide(document.getElementById('content'));

                    window.dispatchEvent(new CustomEvent('playerLogged', { 'detail' : data['response'] }));
                }
            });
        });
        registerForm.addEventListener('submit', function(e){
            e.preventDefault();
            submitForm(registerForm, function(data, xhttp){
                clearMessages(registerForm);
                showMessages(registerForm, data['notifications']);

                if(data['status'] == 1){
                    lock(registerForm);
                    show(loginForm);
                }
            });
        });
    }

    // gestion de l'évènement onplayerdeath
    function gamePlayerDeath(){
        ajaxRequest('backend.php?type=game&task=add_death', 'POST', '', function(data){
            platformer.infos = data['response'];
        });
    }

    // gestion de l'évènement onlevelcomplete
    function gameLevelComplete(stats){
        ajaxRequest('backend.php?type=game&task=update', 'POST', objectToUrlEncoded(stats), function(data){
            platformer.infos = data['response'];
        });
    }

    // gestion de l'évènement onresize
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
