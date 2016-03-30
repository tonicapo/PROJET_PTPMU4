function LevelState(gsh){
    var self = this,
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

    var showVictoryMessage;
    var showDeathMessage;

    var progressBarMargin = 48;
    var progressBarHeight = 4;
    var progressBarWidth;
    var progressX;

    // events généraux
    platformer.events.levelcomplete = new CustomEvent('levelcomplete');
    platformer.events.levelstart = new CustomEvent('levelstart');
    // events liés au player
    platformer.events.playerdeath = new CustomEvent('playerdeath');

    this.init = function(){
        showVictoryMessage = false;
        showDeathMessage = false;


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

        /**
        * Listener
        */
        onetime(window, 'levelcomplete', handleLevelCompleted);
        onetime(window, 'playerdeath', handlePlayerDeath);



        // lancement du jeu
        window.dispatchEvent(platformer.events.levelstart);
    }

    this.update = function(){
        // calcul de la taille de la barre de progression
        progressBarWidth = platformer.game.getScreenWidth() - progressBarMargin * 2;
        progressX = Math.round(progressBarWidth * (player.x - player.getSpawnPosition().x) / (chest.x - player.getSpawnPosition().x));

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
        renderMessages(ctx);
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
        if(player.isDead() || player.isLevelCompleted()){
            return;
        }
        /**
        * VIE DU JOUEUR
        */
        var maxHealth = 153 * platformer.scale;
        var health = player.getHealth() * maxHealth / player.property.maxHealth;


        ctx.save();
        if(health < maxHealth){
            ctx.fillStyle = '#d2d2d2';
            ctx.fillRect(48 + 25 * platformer.scale + 3, 48 + 3, 153 * platformer.scale, 20 * platformer.scale - 6);
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

        ctx.font = '20pt ' + platformer.font;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
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


        /**
        * PROGRESSION
        */
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeRect(progressBarMargin, platformer.game.getScreenHeight() - progressBarHeight - progressBarMargin / 2, progressBarWidth, progressBarHeight);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(progressBarMargin, platformer.game.getScreenHeight() - progressBarHeight - progressBarMargin / 2, progressBarWidth, progressBarHeight);

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#2585b7';
        ctx.fillRect(progressBarMargin, platformer.game.getScreenHeight() - progressBarHeight - progressBarMargin / 2, progressX, progressBarHeight);
        ctx.restore();
    }

    function renderMessages(ctx){
        /**
        * Message de mort
        */
        if(showDeathMessage){
            ctx.save();
            var txt = 'Game Over';

            ctx.fillStyle = '#c74040';
            ctx.fillRect(0, platformer.game.getScreenHeight() * 4/5 - 40, platformer.game.getScreenWidth(), 80);


            ctx.font = '32px ' + platformer.font;
            ctx.textAlign = 'center';
            ctx.lineWidth = 4;


            ctx.strokeStyle = '#000000';
            ctx.strokeText(txt, platformer.game.getScreenWidth() / 2, platformer.game.getScreenHeight() * 4/5 + 32);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(txt, platformer.game.getScreenWidth() / 2, platformer.game.getScreenHeight() * 4/5 + 32);

            ctx.restore();
        }


        /**
        * Message de victoire
        */
        if(showVictoryMessage){
            ctx.save();
            var txt = '+ ' + player.getStat('coins') + ' pièces !';

            ctx.fillStyle = '#2585b7';
            ctx.fillRect(0, platformer.game.getScreenHeight() * 4/5 - 40, platformer.game.getScreenWidth(), 80);


            ctx.font = '32px ' + platformer.font;
            ctx.textAlign = 'center';
            ctx.lineWidth = 4;


            ctx.strokeStyle = '#000000';
            ctx.strokeText(txt, platformer.game.getScreenWidth() / 2, platformer.game.getScreenHeight() * 4/5 + 32);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(txt, platformer.game.getScreenWidth() / 2, platformer.game.getScreenHeight() * 4/5 + 32);

            ctx.restore();
        }
    }

    function handleLevelCompleted(e){
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

        platformer.seed = undefined;

        timers.addTimer(function(){
            showVictoryMessage = true;
        }, 3000);

        var stats = player.getStats();
        console.log(stats);
    }

    function handlePlayerDeath(e){
        e.stopPropagation();

        timers.addTimer(function(){
            showDeathMessage = true;
        }, 1500);

        /**
        - Ajoute une mort au compteur de mort du player
        */

    }
}
