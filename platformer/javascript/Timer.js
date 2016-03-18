function Timer(action, wait){
    var time = timestamp() + wait;
    var paused = false;
    var callback = action;
    var dirty = false;

    this.play = function(){
        paused = false;
    }
    this.pause = function(){
        paused = true;
    }

    this.update = function(){
        if(!paused && timestamp() >= time){
            if(typeof callback === 'function'){
                dirty = true;
                callback();
            }
        }
    }

    this.isDirty = function(){ return dirty; }
}

function TimerManager(){
    var timers = {};
    var index = 0;

    this.update = function(){
        for(var i in timers){
            timers[i].update();

            if(timers[i].isDirty()){
                removeTimer(i);
            }
        }
    }

    this.addTimer = function(action, wait){
        var i = index;

        index++;
        timers[i] = new Timer(action, wait);

        return i;
    }

    function removeTimer(index){
        delete timers[index];
    }
}
