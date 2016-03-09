function Map(level, player){
    var world;

    var tileAcrossX, tileAcrossY;

    var startX, startY, endX, endY;

    var levelSizeX, levelSizeY;

    var numCols, numRows;

    var panX = 0, panY = 0;

    var tilemap;

    var renderlist = [];

    var screenWidth = 0, screenHeight = 0;

    var targetPanX, targetPanY;

    this.init = function(){
        world = new WorldGeneration;
        world.init();

        numCols = world.getNumCols();
        numRows = world.getNumRows();

        levelSizeX = numCols * platformer.tileSizeX;
        levelSizeY = numRows * platformer.tileSizeY;

        tilemap = world.getTilemap();
    }

    this.update = function(){
        screenWidth = platformer.game.getScreenWidth();
        screenHeight = platformer.game.getScreenHeight();

        targetPanX = Math.round(player.x - screenWidth / 2 + player.width / 2);
        targetPanY = Math.round(player.y - screenHeight / 2 + player.height / 2);

        // test
        panX = Math.floor(platformer.math.lerp(panX, targetPanX, 0.05));
        panY = Math.floor(platformer.math.lerp(panY, targetPanY, 0.05));


        tileAcrossX = Math.ceil(screenWidth / platformer.tileSizeX) + 1;
        tileAcrossY = Math.ceil(screenHeight / platformer.tileSizeY) + 1;


        if(panX < 0){
            panX = 0;
        }
        if(panY < 0){
            panY = 0;
        }
        if(panX > levelSizeX - screenWidth){
            panX = levelSizeX - screenWidth;
        }
        if(panY > levelSizeY - screenHeight){
            panY = levelSizeY - screenHeight;
        }

        startX = Math.floor(panX / platformer.tileSizeX);
        startY = Math.floor(panY / platformer.tileSizeY);


        if(startX > numCols - tileAcrossX){
            startX = numCols - tileAcrossX;
        }
        if(startY > numRows - tileAcrossY){
            startY = numRows - tileAcrossY;
        }
        if(startX < 0){
            startX = 0;
        }
        if(startY < 0){
            startY = 0;
        }

        endX = startX + tileAcrossX;
        endY = startY + tileAcrossY;

        if(endX > numCols){
            endX = numCols;
        }
        if(endY > numRows){
            endY = numRows;
        }

        /**
        * Renderlist
        * Liste des tiles visibles par le joueur et nécessitant d'être rendu à l'écran
        */
        renderlist = [];

        for(var x = startX; x < endX; x++){
            for(var y = startY; y < endY; y++){
                if(typeof tilemap[x][y] !== 'undefined' && !tilemap[x][y].equals(platformer.tiletype.void)){
                    renderlist.push(tilemap[x][y]);
                }
            }
        }

        player.update();
    }

    this.render = function(ctx){
        for(var i = 0, n = renderlist.length; i < n; i++){
            renderlist[i].render(ctx, panX, panY);
        }
        player.render(ctx, panX, panY);
    }

    this.getPanX = function(){ return panX; }
    this.getPanY = function(){ return panY; }
    this.getLevelSizeX = function(){ return levelSizeX; }
    this.getLevelSizeY = function(){ return levelSizeY; }
    this.getTilemap = function(){ return tilemap; }
    this.getNumCols = function(){ return numCols; }
    this.getNumRows = function(){ return numRows; }
}
