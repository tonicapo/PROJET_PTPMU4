function LevelState(){
    var self = this,
        map,
        player,
        objects,
        timers;

    this.init = function(){
        // events généraux
        platformer.events.levelcomplete = new CustomEvent('levelcomplete');
        platformer.events.levelstart = new CustomEvent('levelstart');

        timers = new TimerManager;
        objects = {};
        objects.particles = new ArrayList;
        objects.entities = new ArrayList;
        objects.items = new ArrayList;
        objects.loots = new ArrayList;

        player = new Player(this);
        player.init();
        player.setDirection(1);

        // premier plan
        map = new Map(this);
        map.init();

        // arrière plan
        background = new Background('#b4eaf4', platformer.textures.background, 1920, 1080);

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

    this.renderBackground = function(ctx){
        background.render(ctx);
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


    onetime(document, 'levelcomplete', function(e){
        e.stopPropagation();

        /**
        - Envoyer le nombre de pièces
        - Envoyer le nombre de kills
        En gros les stats du player
        */

        var stats = player.getStats();
        
    });
}
