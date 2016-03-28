function MenuState(gsh){
    var choices = [
        'Jouer',
        'Difficulté',
        'Touches'
    ];

    var modes = Object.keys(platformer.mode);

    var selected;
    var posY = 0;

    var logoWidth = 355 * platformer.scale;
    var logoHeight = 122 * platformer.scale;

    var background;

    this.init = function(){
        selected = 0;
        posY = 0;

        background = new Background('#000000', null);
        background.init();
    }

    this.update = function(){
        var targetPosY = (platformer.game.getScreenHeight() - logoHeight) / 2;
        posY = lerp(posY, targetPosY, 0.05);
    }

    this.render = function(ctx){
        ctx.drawImage(platformer.textures.logo, (platformer.game.getScreenWidth() - logoWidth) / 2, posY, logoWidth, logoHeight);
    }

    this.renderBackground = function(ctx){

    }

    this.keyUp = function(key){

    }

    this.keyDown = function(key){
        navigate(key);

        if(key == platformer.keylist.action_attack){
            gsh.setState(1);
        }
    }



    function navigate(key){
        if(key == platformer.keylist.mvt_up){
            selected--;
        }
        else if(key == platformer.keylist.mvt_down){
            selected++
        }

        if(selected < 0){
            selected = choices.length - 1;
        }
        if(selected > choices.length - 1){
            selected = 0;
        }
    }
}
