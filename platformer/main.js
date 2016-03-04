'use strict';

function Game(){
    var self = this;

    var options = {
        id : 'gamescreen',
        dimension : {
            width : 800,
            height : 600
        },
        fullscreen : false,
        scale : true
    };

    var canvas,
        ctx,
        gsh;

    var running = false,
        now,
        delta = 0,
        last = timestamp(),
        step = 1 / 60;



    this.init = function(){
        initGameScreen();

        window.addEventListener('resize', function(){
            if(options.fullscreen){
                self.fullscreen();
            }
        });

        window.addEventListener('blur', function(){
            pause();
        });

        window.addEventListener('focus', function(){
            resume();
        });

        //gsh = new GameStateHandler;
        //gsh.init();

        start();
    }


    /**
    * Game loop
    */
    function pause(){
        if(running){
            console.info('PAUSE');
            running = false;
        }
    }
    function resume(){
        if(!running){
            console.info('RESUME');
            running = true;
        }
    }

    function togglePause(){
        (!running) ? resume() : pause();
    }

    function start(){
        console.info('START');
        running = true;
        requestAnimationFrame(run);
    }

    function run(){
        now = timestamp();
        delta += Math.min(1, (now - last) / 1000);

        while(delta > step){
            delta -= step;
            if(running){
                //gsh.update();
            }
        }

        //gsh.render();
        last = now;

        requestAnimationFrame(run);
    }

    /**
    * Retourne la timestamp courante
    */
    function timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }


    /**
    * Sert à inclure un fichier dans le document
    * path - Le chemin vers le fichier
    * callback - Fonction exécutée une fois le fichier chargé
    */
    function include(path, tmp){
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
    * INIT
    */

    function initGameScreen(){
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d');
        canvas.setAttribute('id', options.id);
        canvas.style.imageRendering = 'pixelated';
        canvas.style.backgroundColor = '#F1F1F1';
        canvas.mozOpaque = true;
        document.body.appendChild(canvas);

        if(options.fullscreen){
            self.fullscreen();
        }
        else{
            self.windowed();
        }
    }


    /**
    * DIMENSIONS
    */

    /**
    * Change la taille de la canvas
    */
    function resizeGameScreen(width, height){
        canvas.setAttribute('width', parseInt(width, 10));
        canvas.setAttribute('height', parseInt(height, 10));

        scaleGameScreen();
        // désactive le lissage des images
        disableSmoothing();
    }

    this.fullscreen = function(){
        resizeGameScreen(window.innerWidth, window.innerHeight);
        options.fullscreen = true;
    }

    this.windowed = function(){
        resizeGameScreen(options.dimension.width, options.dimension.height);
        options.fullscreen = false;
    }

    /**
    * Sert à désactiver le lissage des images (le jeu est pixelisé)
    */
    function disableSmoothing(){
        ctx.mozImageSmoothingEnabled = false;
        ctx.oImageSmoothingEnabled = false;
        ctx.webkitImageSmoothingEnabled = false; // donne un warning sous Chrome mais toujours nécessaire sur Safari
        ctx.msImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
    }

    /**
    * Redimensionnement pour les écrans HiDPI, avoir des polices non pixelisées
    * Solution trouvé sur :
    * http://www.html5rocks.com/en/tutorials/canvas/hidpi/#disqus_thread
    */
    function scaleGameScreen(){
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
                            ctx.mozBackingStorePixelRatio ||
                            ctx.msBackingStorePixelRatio ||
                            ctx.oBackingStorePixelRatio ||
                            ctx.backingStorePixelRatio || 1;
        var ratio = devicePixelRatio / backingStoreRatio;

        if(options.scale && devicePixelRatio !== backingStoreRatio){
            var oldWidth = canvas.width;
            var oldHeight = canvas.height;

            canvas.width = oldWidth * ratio;
            canvas.height = oldHeight * ratio;

            canvas.style.width = oldWidth + 'px';
            canvas.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element
            ctx.scale(ratio, ratio);
        }
    }


    // getters
    this.getScreenWidth = function(){ return canvas.width; }
    this.getScreenHeight = function(){ return canvas.height; }
}


var game = new Game;
game.init();
