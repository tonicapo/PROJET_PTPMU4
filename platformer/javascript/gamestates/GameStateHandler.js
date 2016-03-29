function GameStateHandler(){
    var self = this;
    var current;

    /**
    * Liste des stages disponibles dans le jeu
    */
    var states = [];

    this.init = function(){
        // on charge les stages du jeu et on initialise le premier
        states.push(new MenuState(this));
        states.push(new LevelState(this));
        this.setState(0);


        window.addEventListener('keyup', function(e){
            self.keyUp(e);
        });

        window.addEventListener('keydown', function(e){
            self.keyDown(e);
        });
    }

    /**
    * Change le stage courant et l'initialise
    * i - Indice du stage
    */
    this.setState = function(i){
        if(current != i){
            current = i;
            states[current].init();
        }
    }

    /**
    * Relance le stage courant
    */
    this.reloadState = function(){
        states[current].init();
    }

    this.update = function(){
        states[current].update();
    }

    this.render = function(ctx){
        ctx.clearRect(0, 0, platformer.game.getScreenWidth(), platformer.game.getScreenHeight());
        this.renderBackground(ctx);
        states[current].render(ctx);
    }

    this.renderBackground = function(ctx){
        states[current].renderBackground(ctx);
    }

    /**
    * current - Indice du stage courant
    */
    this.getCurrent = function(){
        return current;
    }

    this.keyUp = function(e){
        var key = e.keyCode || e.which;
        states[current].keyUp(key);
    }

    this.keyDown = function(e){
        var key = e.keyCode || e.which;
        states[current].keyDown(key);

        if(key == platformer.keylist.toggle_fullscreen && platformer.resizeable){
            platformer.game.toggleFullscreen();
        }
    }
}
