function LevelState(){
    var self = this,
        map,
        player,
        objects,
        timers;

    this.init = function(){
        timers = new TimerManager;

        objects = {};
        objects.particles = new ArrayList;
        objects.entities = new ArrayList;
        objects.items = new ArrayList;

        map = new Map(this);
        map.init();

        player = new Player(this, new Position(5, map.getNumRows() - 6));
        player.init();
        player.setDirection(1);

        this.spawnEntity(new Enemy(this, new Position(9, map.getNumRows() - 6)));
        this.spawnEntity(new Enemy(this, new Position(5, map.getNumRows() - 6)));
        this.spawnEntity(new Enemy(this, new Position(16, map.getNumRows() - 9)));
    }

    this.update = function(){
        objects.particles.clean();
        objects.entities.clean();
        objects.items.clean();

        timers.update();
        map.update();

        player.update();
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


    this.spawnEntity = function(o){
        o.init();
        objects.entities.add(o);
    }
    this.spawnItem = function(o){
        o.init();
        objects.items.add(o);
    }
    this.spawnParticle = function(o){
        o.init();
        objects.particles.add(o);
    }

    this.getMap = function(){ return map; }
    this.getTimers = function(){ return timers; }

    this.getItems = function(){ return objects.items.getList(); }
    this.getEntities = function(){ return objects.entities.getList(); }
    this.getParticles = function(){ return objects.particles.getList(); }

    this.getPlayer = function(){ return player; }
}
