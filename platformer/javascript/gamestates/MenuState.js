function MenuState(gsh){
    var choices = [
        'Jouer',
        'Mode de jeu'
    ];

    var timers;

    var modes = Object.keys(platformer.mode);

    var selectedChoice;
    var targetLogoPosY = 0;
    var logoPosY = 0;

    var logoWidth = 355 * platformer.scale;
    var logoHeight = 122 * platformer.scale;

    var background;


    this.init = function(){
        var storedMode = parseInt(JSON.parse(localStorage.getItem('platformer_difficulty')));
        if(typeof storedMode !== 'undefined'){
            setActiveMode(storedMode);
        }

        selectedChoice = 0;

        timers = new TimerManager;

        logoPosY = 0;

        background = new Background('#000000', null);
        background.init();
    }

    this.update = function(){
        targetLogoPosY = platformer.game.getScreenHeight() / 2 - logoHeight;
        if(logoPosY < targetLogoPosY) logoPosY = lerp(logoPosY, targetLogoPosY, 0.05);
        else logoPosY = targetLogoPosY;

        timers.update();
    }

    this.render = function(ctx){
        /**
        * LOGO
        */
        ctx.drawImage(platformer.textures.logo, (platformer.game.getScreenWidth() - logoWidth) / 2, logoPosY, logoWidth, logoHeight);

        /**
        * STATS
        */
        ctx.save();
        ctx.font = '12pt ' + platformer.font;
        ctx.textAlign = 'left';
        ctx.fillStyle = '#dadada';
        ctx.fillText('', 48, 48);
        ctx.restore();

        /**
        * MENU
        */
        ctx.save();
        ctx.font = '14pt ' + platformer.font;
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';

        var menuY = targetLogoPosY + logoHeight;
        var arrowWidth = 11 * platformer.scale;
        var arrowHeight = 6 * platformer.scale;

        // flèches de sélection verticales
        ctx.drawImage(platformer.textures.gui.arrows[0], (platformer.game.getScreenWidth() - arrowWidth) / 2, menuY, arrowWidth, arrowHeight);
        ctx.drawImage(platformer.textures.gui.arrows[1], (platformer.game.getScreenWidth() - arrowWidth) / 2, menuY + 64 * choices.length + 20 * 2, arrowWidth, arrowHeight);


        menuY += 64 + 20;


        for(var i = 0; i < choices.length; i++){
            var text = choices[i];

            if(selectedChoice == i){
                // cadre
                ctx.fillStyle = 'rgba(255, 255, 255, 0.075)';
                ctx.fillRect(platformer.game.getScreenWidth() / 2 - 100, menuY + i * 64 - 48, 200, 48);
                ctx.strokeStyle = '#A6374B';
                ctx.strokeRect(platformer.game.getScreenWidth() / 2 - 100, menuY + i * 64 - 48, 200, 48);

                ctx.fillStyle = '#dadada';

                // flèches de sélection horizontales
                if(selectedChoice == 1 && i == 1){
                    text = platformer.difficulty.name;

                    ctx.drawImage(platformer.textures.gui.arrows[2], (platformer.game.getScreenWidth() - arrowHeight) / 2 - 103 - arrowHeight - 20, menuY + i * 64 - 48 + (48 - arrowWidth) / 2, arrowHeight, arrowWidth);
                    ctx.drawImage(platformer.textures.gui.arrows[3], (platformer.game.getScreenWidth() - arrowHeight) / 2 + 103 + arrowHeight + 20, menuY + i * 64 - 48 + (48 - arrowWidth) / 2, arrowHeight, arrowWidth);

                }
            }
            else{
                ctx.fillStyle = '#353535';
            }

            ctx.fillText(text, platformer.game.getScreenWidth() / 2, menuY + i * 64 - 4);
        }
        ctx.restore();


        menuY += choices.length * 64 + 64;

        /**
        * SYNOPSIS
        */
        ctx.save();
        ctx.font = '12pt ' + platformer.font;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#757575';
        for(var j = 0; j < platformer.difficulty.text.length; j++){
            ctx.fillText(platformer.difficulty.text[j], platformer.game.getScreenWidth() / 2, menuY + 32 * j);
        }
        ctx.restore();
    }

    this.renderBackground = function(ctx){

    }

    this.keyUp = function(key){

    }

    this.keyDown = function(key){
        choiceNavigation(key);

        if(selectedChoice == 1){
            modeNavigation(key);
        }
        else if(selectedChoice == 0){
            if(key == platformer.keylist.action_attack){
                platformer.seed = undefined;
                gsh.setState(1);
            }
        }
    }



    function choiceNavigation(key){
        if(key == platformer.keylist.mvt_up){
            selectedChoice--;
        }
        else if(key == platformer.keylist.mvt_down){
            selectedChoice++
        }

        if(selectedChoice < 0){
            selectedChoice = choices.length - 1;
        }
        if(selectedChoice > choices.length - 1){
            selectedChoice = 0;
        }
    }

    function modeNavigation(key){
        var mode = getActiveModeID();
        if(key == platformer.keylist.mvt_left){
            mode--;
        }
        else if(key == platformer.keylist.mvt_right){
            mode++;
        }

        setActiveMode(mode);
    }

    function getActiveModeID(){
        var modeID = 0;
        for(var i = 0; i < modes.length; i++){
            if(platformer.difficulty == platformer.mode[modes[i]]){
                modeID = i;
                break;
            }
        }

        return modeID;
    }

    function setActiveMode(mode){
        if(mode < 0 || isNaN(mode)){
            mode = 0;
        }
        if(mode > modes.length - 1){
            mode = modes.length - 1;
        }

        platformer.difficulty = platformer.mode[modes[mode]];
        localStorage.setItem('platformer_difficulty', JSON.stringify(mode));
    }
}
