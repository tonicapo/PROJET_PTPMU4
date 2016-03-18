function AnimatedObject(x, y, width, height){
    Rectangle.call(this, x, y, width, height);

    var currentAnimation;

    // liste des animations
    this.animationList = {};

    this.init = function(){
        for(var i in this.animationList){
            this.animationList[i].init();
        }

        this.setAnimation(this.animationList[Object.keys(this.animationList)[0]]);
    }

    this.animate = function(){
        // change animations
    }

    this.updateObject = function(){
        if(currentAnimation.canSkipAnimation()){
            this.animate();
        }

        if(currentAnimation != undefined){
            currentAnimation.update();
        }
    }

    this.setAnimation = function(tmp){
        if(typeof tmp !== 'undefined' && (typeof currentAnimation === 'undefined' || currentAnimation.getID() != tmp.getID())){
            currentAnimation = tmp;
        }
    }

    this.getTexture = function(){ return currentAnimation.getFrame(); }
}
