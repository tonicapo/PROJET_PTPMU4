function GameStateHandler(){
    var global = this;
    var current;

    /**
    * Liste des stages disponibles dans le jeu
    */
    var states = [];

    this.init = function(){
        // on charge les stages du jeu et on initialise le premier
        states.push(new LevelState);
        this.setState(0);
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
        states[current].render(ctx);
    }

    /**
    * current - Indice du stage courant
    */
    this.getCurrent = function(){
        return current;
    }

    window.onkeyup = function(e){
        var key = e.keyCode || e.which;
        states[current].keyUp(key);
    }

    window.onkeydown = function(e){
        var key = e.keyCode || e.which;
        states[current].keyDown(key);

        if(key == platformer.keylist.toggle_fullscreen){
            platformer.game.toggleFullscreen();
        }
        else if(key == platformer.keylist.toggle_restart){
            global.reloadState();
        }
        else if(key == platformer.keylist.toggle_pause){
            platformer.game.togglePause();
        }
    }
}
