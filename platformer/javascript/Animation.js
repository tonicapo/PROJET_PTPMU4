function Animation(id, frames, speed, options){
    var options = options || {};

    // permet de définir si l'animation peut être interrompue ou non
    var cancelable = (typeof options.cancelable !== 'undefined') ? options.cancelable : true;
    // permet de répéter ou non l'animation une fois terminée indéfiniement
    var loop = (typeof options.loop !== 'undefined') ? options.loop : true;
    // permet de sélectionner la prochaine frame au hasard
    var random = (typeof options.random !== 'undefined') ? options.random : false;

    var currentFrame;
    var paused;
    var time;
    var playedOnce;

    var size = frames.length;

    this.play = function(){
        paused = false;
    }
    this.pause = function(){
        paused = true;
    }

    this.reset = function(){
        currentFrame = 0;
        playedOnce = false;
    }

    this.init = function(){
        currentFrame = 0;
        playedOnce = false;

        this.play();
    }

    this.update = function(){
        time = time || timestamp();

        if(size > 1 && !paused && timestamp() - time >= speed && ((!playedOnce && cancelable == false) || (loop == true && cancelable == true))){
            time = timestamp();

            if(!random){
                currentFrame++;

                if(currentFrame > size - 1){
                    currentFrame = 0;
                }
                if(currentFrame < 0){
                    currentFrame = size - 1;
                }

                if(currentFrame == size - 1){
                    playedOnce = true;
                }
            }
            else{
                currentFrame = randomInt(0, size - 1);
            }
        }
    }

    this.getFrame = function(){
        return frames[currentFrame];
    }

    this.hasPlayedOnce = function(){
        return playedOnce;
    }

    this.getID = function(){ return id; }

    this.canSkipAnimation = function(){
        if(cancelable == false){
            if(playedOnce && loop){
                playedOnce = false;
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return true;
        }
    }

    this.getSpeed = function(){ return speed; }
}
