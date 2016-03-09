function LevelState(){
    var self = this,
        map,
        player;

    this.init = function(){
        player = new Player(this, new Position(1, 1));
        player.init();

        map = new Map(this, player);
        map.init();

        player.spawn(new Position(2, map.getNumRows() - 2));
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
