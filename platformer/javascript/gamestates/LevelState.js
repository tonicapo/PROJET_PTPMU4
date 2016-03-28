function LevelState(gsh){
    var self,
        map,
        player,
        objects,
        timers,
        winZone,
        chest;

    this.init = function(){
        self = this;

        // events généraux
        platformer.events.levelcomplete = new CustomEvent('levelcomplete');
        platformer.events.levelstart = new CustomEvent('levelstart');

        if(typeof timers !== 'undefined'){
            timers.empty();
        }

        timers = new TimerManager;
        objects = {};
        objects.particles = new ArrayList;
        objects.entities = new ArrayList;
        objects.items = new ArrayList;
        objects.loots = new ArrayList;

        platformer.weapons.bow = new BowItem(this);
        platformer.weapons.fireBallSpell = new FireBallSpellItem(this);
        platformer.weapons.knife = new KnifeItem(this);
        platformer.weapons.sword = new SwordItem(this);
        platformer.weapons.bossFeet = new BossFeetItem(this);

        player = new Player(this);
        player.init();
        player.setDirection(1);

        // premier plan
        map = new Map(this);
        map.init();

        // arrière plan
        background = new Background('#b4eaf4', platformer.textures.background);
        background.init();

        chest = map.getChest();

        /**
        * Zone de fin
        */
        var c = chest.getCenter();
        winZone = new Rectangle(c.x - platformer.tileSizeX - chest.width / 2, c.y - platformer.tileSizeY - chest.width / 2, platformer.tileSizeX * 2 + chest.width, platformer.tileSizeY * 2 + chest.height);


        // lancement du jeu
        document.dispatchEvent(platformer.events.levelstart);
    }

    this.update = function(){
        timers.update();
        map.update();

        player.update();

        if(!(!player.intersects(winZone) || player.isLevelCompleted() || player.isFalling())){
            player.setLevelCompleted();
            window.dispatchEvent(platformer.events.levelcomplete);
        }
    }

    this.render = function(ctx){
        map.render(ctx);
        renderGui(ctx);
        //drawWinZone(ctx);
    }

    this.renderBackground = function(ctx){

    }


    this.keyUp = function(key){
        player.keyUp(key);
    }

    this.keyDown = function(key){
        player.keyDown(key);

        if(key == platformer.keylist.toggle_restart){
            gsh.reloadState();
        }
        else if(key == platformer.keylist.toggle_pause){
            platformer.game.togglePause();
        }
        else if(key == platformer.keylist.toggle_menu){
            gsh.setState(0);
        }
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

    function drawWinZone(ctx){
        ctx.fillStyle = '#000';
        ctx.strokeRect(winZone.x - map.getPanX(), winZone.y - map.getPanY(), winZone.width, winZone.height);
    }

    function renderGui(ctx){
        var maxHealth = 160 * platformer.scale - 6;
        var health = player.getHealth() * maxHealth / player.property.maxHealth;
        // Barre de vie
        ctx.save();
        if(health < maxHealth){
            ctx.fillStyle = '#d2d2d2';
            ctx.fillRect(48 + 3, 48 + 3, 160 * platformer.scale - 6, 20 * platformer.scale - 6);
        }
        ctx.fillStyle = '#ed5050';
        ctx.fillRect(48 + 3, 48 + 3, health, 20 * platformer.scale - 6);
        ctx.restore();

        ctx.drawImage(platformer.textures.gui.healthbar, 48, 48, 160 * platformer.scale, 20 * platformer.scale);
    }

    onetime(window, 'levelcomplete', function(e){
        e.stopPropagation();

        // tue toutes les entités
        var entities = self.getEntities();
        for(var i in entities){
            if(entities[i]){
                if(!entities[i].isDead()){
                    entities[i].setCanDropLoot(false);
                    entities[i].setDamage(entities[i], 1000, 0, 1, 2);
                }
            }
        }
        /**
        - Envoyer le nombre de pièces
        - Envoyer le nombre de kills
        */

        var stats = player.getStats();
        console.log(stats);
    });


    /**
    * Events
    */

    /*
    * TODO : durée de jeu
    */
    onetime(window, 'playerdeath', function(e){
        e.stopPropagation();
        /**
        - Ajoute une mort au compteur de mort du player
        */
        console.log('Player died');
    });
}
