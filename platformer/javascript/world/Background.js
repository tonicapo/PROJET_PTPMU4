function Background(color, image, width, height){

    this.render = function(ctx){
        ctx.fillStyle = color;
        var screenWidth = platformer.game.getScreenWidth() * platformer.game.getRatio();
        var screenHeight = platformer.game.getScreenHeight() * platformer.game.getRatio();

        var screenWidth = platformer.game.getScreenWidth() * platformer.game.getRatio();
        var screenHeight = platformer.game.getScreenHeight() * platformer.game.getRatio();

        ctx.clearRect(0, 0, screenWidth, screenHeight);

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        ctx.drawImage(image, 0, 0, width, height, 0, 0, screenWidth, screenHeight);
        ctx.globalAlpha = 0.6;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        
    }
}
