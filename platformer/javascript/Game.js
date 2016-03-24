function Game(){
    var self = this;

    var gameWrapper;
    var ratio = 1;

    var options = {
        id : 'gamescreen',
        dimension : {
            width : platformer.dimension.w,
            height : platformer.dimension.h
        },
        fullscreen : platformer.fullscreen,
        scale : true
    };

    var foreground,
        ctxForeground,
        gsh,
        running = false,
        now,
        delta = 0,
        last = timestamp(),
        step = 1 / 60,

        screenWidth,
        screenHeight;

    this.init = function(){
        /**
        * Création d'un canvas
        * Gestion des ressources du jeu
        * Lancement du jeu
        */

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

        /**
        * On récupère les ressources et on lance le jeu
        */
        gsh = new GameStateHandler;
        gsh.init();

        start();
    }


    /**
    * Game loop
    * Pour plus de détails :
    * http://codeincomplete.com/posts/2013/12/4/javascript_game_foundations_the_game_loop/
    */
    function pause(){
        platformer.notify('PAUSE');
        running = false;
    }
    function resume(){
        if(!running){
            platformer.notify('RESUME');
            running = true;
        }
    }

    this.togglePause = function(){
        (!running) ? resume() : pause();
    }

    function start(){
        platformer.notify('START');
        running = true;
        requestAnimationFrame(run);
    }

    function run(){
        now = timestamp();
        delta += Math.min(1, (now - last) / 1000);

        while(delta >= step){
            delta -= step;
            if(running){
                gsh.update();
            }
        }

        gsh.render(ctxForeground);
        last = now;

        requestAnimationFrame(run);
    }

    /**
    * INIT
    */

    function initGameScreen(){
        // le conteneur du jeu
        gameWrapper = document.createElement('div');
        gameWrapper.setAttribute('id', platformer.id);
        gameWrapper.style.position = 'relative';
        document.body.appendChild(gameWrapper);

        // le premier plan pour le rendu dynamique
        foreground = createCanvas(options.id, 1);


        if(options.fullscreen){
            self.fullscreen();
        }
        else{
            self.windowed();
        }
    }


    function createCanvas(id, zindex){
        var element = document.createElement('canvas');
        gameWrapper.appendChild(element);

        element.setAttribute('id', id);
        element.style.imageRendering = 'pixelated';
        element.mozOpaque = true;

        element.style.position = 'absolute';
        element.style.top = '0px';
        element.style.left = '0px';
        element.style.zIndex = zindex;

        return element;
    }

    /**
    * DIMENSIONS
    */

    /**
    * Change la taille de la canvas
    */
    function resizeGameScreen(width, height){
        var width = parseInt(width, 10);
        var height = parseInt(height, 10);

        foreground.setAttribute('width', width);
        foreground.setAttribute('height', height);

        gameWrapper.style.width = width + 'px';
        gameWrapper.style.height = height + 'px';

        if(options.fullscreen){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }

        ctxForeground = foreground.getContext('2d');
        // fix pour les écrans retina et autres résolutions hautes
        ctxForeground = scaleGameScreen(ctxForeground);
        // désactive le lissage des images
        ctxForeground = disableSmoothing(ctxForeground);

        screenWidth = parseInt(window.getComputedStyle(foreground).width, 10);
        screenHeight = parseInt(window.getComputedStyle(foreground).height, 10);
    }

    this.toggleFullscreen = function(){
        (!options.fullscreen) ? this.fullscreen() : this.windowed();
    }

    this.fullscreen = function(){
        platformer.notify('FULLSCREEN MODE');
        options.fullscreen = true;
        resizeGameScreen(window.innerWidth, window.innerHeight);
    }

    this.windowed = function(){
        platformer.notify('WINDOWED MODE');
        options.fullscreen = false;
        resizeGameScreen(options.dimension.width, options.dimension.height);
    }

    /**
    * Sert à désactiver le lissage des images (le jeu est pixelisé)
    */
    function disableSmoothing(context){
        context.mozImageSmoothingEnabled = false;
        context.oImageSmoothingEnabled = false;
        context.webkitImageSmoothingEnabled = false; // donne un warning sous Chrome mais toujours nécessaire sur Safari
        context.msImageSmoothingEnabled = false;
        context.imageSmoothingEnabled = false;

        return context;
    }

    /**
    * Redimensionnement pour les écrans HiDPI, avoir des polices non pixelisées
    * Solution trouvé sur :
    * http://www.html5rocks.com/en/tutorials/canvas/hidpi/#disqus_thread
    */
    function scaleGameScreen(context){
        var devicePixelRatio = window.devicePixelRatio || 1;
        var backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1;

        ratio = toFloat(devicePixelRatio / backingStoreRatio);

        if(options.scale && devicePixelRatio !== backingStoreRatio){
            var oldWidth = foreground.width;
            var oldHeight = foreground.height;

            foreground.width = oldWidth * ratio;
            foreground.height = oldHeight * ratio;
            foreground.style.width = oldWidth + 'px';
            foreground.style.height = oldHeight + 'px';

            // now scale the context to counter
            // the fact that we've manually scaled
            // our canvas element

            context.scale(ratio, ratio);
        }

        return context;
    }


    // getters
    this.getScreenWidth = function(){ return screenWidth; }
    this.getScreenHeight = function(){ return screenHeight }

    this.getRatio = function(){ return ratio; }
}
