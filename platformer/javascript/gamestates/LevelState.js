function LevelState(){
    var self = this;

    var map;
    var player;

    this.init = function(){
        player = new Player(this, new Position(1, 1));

        map = new Map(this, player);
        map.init();
    }

    this.update = function(){
        map.update();
    }

    this.render = function(ctx){
        map.render(ctx);
    }

    this.keyUp = function(key){
        player.keyUp(key);
    }

    this.keyDown = function(key){
        player.keyDown(key);
    }

    this.getMap = function(){ return map; }
}
