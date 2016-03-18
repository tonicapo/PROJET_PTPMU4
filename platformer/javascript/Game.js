function Game(){
    var self = this;

    var options = {
        id : 'gamescreen',
        dimension : {
            width : platformer.dimension.w,
            height : platformer.dimension.h
        },
        fullscreen : true,
        scale : true
    };

    var canvas,
        ctx,
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
        * On récupère les ressources
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
                //console.log(delta);
                gsh.update(delta / step);
            }
        }

        gsh.render(ctx);
        last = now;

        requestAnimationFrame(run);
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

        if(options.fullscreen){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'auto';
        }

        scaleGameScreen();
        // désactive le lissage des images
        disableSmoothing();

        screenWidth = parseInt(window.getComputedStyle(canvas).width, 10);
        screenHeight = parseInt(window.getComputedStyle(canvas).height, 10);
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

        var ratio = toFloat(devicePixelRatio / backingStoreRatio);

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
    this.getScreenWidth = function(){ return screenWidth; }
    this.getScreenHeight = function(){ return screenHeight }
}
