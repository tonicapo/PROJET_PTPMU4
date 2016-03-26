function Background(color, image, width, height){
    this.render = function(ctx){
        var screenWidth = platformer.game.getScreenWidth();
        var screenHeight = platformer.game.getScreenHeight();

        ctx.save();
        // fond de couleur
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        // image de fond
        ctx.drawImage(image, 0, -Math.abs(screenHeight - height), screenWidth, screenHeight);
        // flou de distance
        ctx.globalAlpha = 0.65;
        ctx.fillRect(0, 0, screenWidth, screenHeight);
        ctx.restore();
    }
}
