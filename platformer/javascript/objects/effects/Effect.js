function Effect(level, animation, position, width, height){
    Rectangle.call(this, position.x, position.y, width, height);

    var self = this;
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);
    this.setFixedToBottom(false);

    level.getTimers().addTimer(function(){
        self.setDirty(true);
    }, animation.getSpeed());

    this.init = function(){
        animation.init();
    }

    this.render = function(ctx, panX, panY){
        var renderBox = this.getRenderBox();
        ctx.drawImage(animation.getFrame(), renderBox.x - panX, renderBox.y - panY, renderBox.width, renderBox.height);
    }

    this.update = function(){
        animation.update();
    }
}

function FireBallExplosion(level, position){
    Effect.call(this, level, new Animation('explosion', platformer.textures.effects.fireBallExploding, 200, { cancelable : false }), position, platformer.tileSizeX, platformer.tileSizeY);
}
