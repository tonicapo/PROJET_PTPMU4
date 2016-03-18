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
        objects.loots = new ArrayList;

        map = new Map(this);
        map.init();

        player = new Player(this, getPositionAtCoord(5, map.getNumRows() - 6));
        player.init();
        player.setDirection(1);

        this.spawnEntity(new Enemy(this, getPositionAtCoord(13, map.getNumRows() - 6)));
        this.spawnEntity(new Enemy(this, getPositionAtCoord(20, map.getNumRows() - 9)));

        this.spawnLoot(new Coin(this, getPositionAtCoord(8, map.getNumRows() - 6)));
        this.spawnLoot(new Coin(this, getPositionAtCoord(7, map.getNumRows() - 6)));


        // lancement du jeu
        document.dispatchEvent(platformer.events.levelstart);
    }

    this.update = function(){
        for(var i in objects){
            objects[i].clean();
        }

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
    this.spawnLoot = function(o){
        o.init();
        objects.loots.add(o);
    }

    this.getMap = function(){ return map; }
    this.getTimers = function(){ return timers; }

    this.getItems = function(){ return objects.items.getList(); }
    this.getEntities = function(){ return objects.entities.getList(); }
    this.getParticles = function(){ return objects.particles.getList(); }
    this.getLoots = function(){ return objects.loots.getList(); }

    this.getPlayer = function(){ return player; }
}
