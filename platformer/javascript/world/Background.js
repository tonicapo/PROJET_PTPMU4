function Background(color, image, width, height){
    this.render = function(ctx){
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, platformer.game.getScreenWidth(), platformer.game.getScreenHeight());
    }
}
