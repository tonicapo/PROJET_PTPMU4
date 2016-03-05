function Game(){
    var global = this;

    var options = {
        id : 'gamescreen',
        dimension : {
            width : platformer.dimension.w,
            height : platformer.dimension.h
        },
        fullscreen : false,
        scale : true
    };

    var canvas,
        ctx,
        gsh,
        running = false,
        now,
        delta = 0,
        last = timestamp(),
        step = 1 / 60;



    this.init = function(){
        initGameScreen();

        window.addEventListener('resize', function(){
            if(options.fullscreen){
                global.fullscreen();
            }
        });

        window.addEventListener('blur', function(){
            pause();
        });

        window.addEventListener('focus', function(){
            resume();
        });

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

        while(delta > step){
            delta -= step;
            if(running){
                gsh.update();
            }
        }

        gsh.render(ctx);
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
            global.fullscreen();
        }
        else{
            global.windowed();
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

    this.toggleFullscreen = function(){
        (!options.fullscreen) ? this.fullscreen() : this.windowed();
    }

    this.fullscreen = function(){
        platformer.notify('FULLSCREEN MODE');
        resizeGameScreen(window.innerWidth, window.innerHeight);
        options.fullscreen = true;
    }

    this.windowed = function(){
        platformer.notify('WINDOWED MODE');
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
