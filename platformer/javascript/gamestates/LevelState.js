function LevelState(gsh){
    var self,
        map,
        player,
        objects,
        timers,
        winZone,
        chest,
        bonusNames,
        activeEffects,
        entitiesCount,
        remainingEntities;

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

        bonusNames = Object.keys(player.getEachBonus())

        // premier plan
        map = new Map(this);
        map.init();

        entitiesCount = map.getEntitiesCount();

        // arrière plan
        background = new Background('#b4eaf4', platformer.textures.background);
        background.init();

        chest = map.getChest();


        activeEffects = [];
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

        remainingEntities = getRemainingEntitiesLength();

        activeEffects = [];
        for(var i = 0; i < bonusNames.length; i++){
            if(player.getBonus(bonusNames[i]) > 1){
                var texture;
                switch(bonusNames[i]){
                    case 'speed' : texture = platformer.textures.items.speedPotion[0]; name = 'Vitesse'; break;
                    case 'resistance' : texture = platformer.textures.items.resistancePotion[0]; name = 'Résistance'; break;
                    case 'strength' : texture = platformer.textures.items.strengthPotion[0]; name = 'Force'; break;
                }
                if(typeof texture !== 'undefined'){
                    activeEffects.push({ texture : texture, name : name });
                }
            }
        }

        /**
        * on vérifie si le jeu est terminé
        */
        if(!(!player.intersects(winZone) || player.isLevelCompleted() || player.isFalling())){
            var killCondition = platformer.difficulty.killAllMobsToComplete;
            if(!killCondition || (killCondition && remainingEntities <= 0)){
                player.setLevelCompleted();
                window.dispatchEvent(platformer.events.levelcomplete);
            }
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

    function getRemainingEntitiesLength(){
        var c = 0;
        var list = self.getEntities();

        for(var i in list){
            if(typeof list[i] !== 'undefined' && !list[i].isDead()){
                c++;
            }
        }

        return c;
    }

    function drawWinZone(ctx){
        ctx.fillStyle = '#000';
        ctx.strokeRect(winZone.x - map.getPanX(), winZone.y - map.getPanY(), winZone.width, winZone.height);
    }

    function renderGui(ctx){
        /**
        * VIE DU JOUEUR
        */
        var maxHealth = 153 * platformer.scale;
        var health = player.getHealth() * maxHealth / player.property.maxHealth;


        ctx.save();
        if(health < maxHealth){
            ctx.fillStyle = '#d2d2d2';
            ctx.fillRect(48 + 25 * platformer.scale + 3, 48 + 3, 160 * platformer.scale - 6, 20 * platformer.scale - 6);
        }
        ctx.fillStyle = '#ed5050';
        ctx.fillRect(48 + 25 * platformer.scale + 3, 48 + 3, health, 20 * platformer.scale - 6);
        ctx.restore();

        ctx.drawImage(platformer.textures.gui.healthbar, 48, 48, 192 * platformer.scale, 46 * platformer.scale);


        /**
        * STATS
        */
        ctx.save();
        var x = 48 + 25 * platformer.scale + 3;
        var y = 48 + 46 + 27 + 28;
        var strokeSize = 2;

        ctx.font = '20pt ' + platformer.font;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.fillStyle = '#FFFFFF';
        // pièces
        ctx.strokeText(player.getStat('coins'), x, y);
        ctx.fillText(player.getStat('coins'), x, y);
        if(platformer.difficulty != platformer.mode['peaceful']){
            // kills
            ctx.strokeText(remainingEntities + '/' + entitiesCount, x + 128, y);
            ctx.fillText(remainingEntities + '/' + entitiesCount, x + 128, y);
        }
        ctx.restore();

        /**
        * ARMES EQUIPEE
        */
        var weapon = player.getSelectedItem();
        if(typeof weapon !== 'undefined'){
            ctx.drawImage(weapon.getTexture(), 48 - 3 * platformer.scale, 48 * 4, 32 * platformer.scale, 32 * platformer.scale);
        }

        /**
        * EFFETS DE POTION
        */
        var y = 48;
        for(var i = 0; i < activeEffects.length; i++){
            ctx.drawImage(activeEffects[i].texture, 48 - 10 * platformer.scale, 32 * platformer.scale + 48 * 4 + 48 * i, 32 * platformer.scale, 32 * platformer.scale);
            ctx.save();
            ctx.font = '12pt ' + platformer.font;
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 4;
            ctx.fillStyle = '#FFFFFF';
            ctx.strokeText(activeEffects[i].name, 48 - 10 * platformer.scale + 32 * platformer.scale + 12, 32 * platformer.scale + 48 * 4 + 48 * i + 32 * platformer.scale / 2 + 14);
            ctx.fillText(activeEffects[i].name, 48 - 10 * platformer.scale + 32 * platformer.scale + 12, 32 * platformer.scale + 48 * 4 + 48 * i + 32 * platformer.scale / 2 + 14);
            ctx.restore();
        }
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
