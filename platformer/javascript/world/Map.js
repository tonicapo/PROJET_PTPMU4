function Map(level){
    var world,
        tileAcrossX,
        tileAcrossY,

        startX,
        startY,
        endX,
        endY,

        levelSizeX,
        levelSizeY,

        numCols,
        numRows,

        panX = 0,
        panY = 0,

        tilemap,

        renderlist,

        screenWidth = 0,
        screenHeight = 0,

        targetPanX,
        targetPanY,

        updateDistance = 1000,

        minDistance,
        maxDistance;


    this.init = function(){
        world = new WorldGeneration(level);
        world.init();

        numCols = world.getNumCols();
        numRows = world.getNumRows();

        levelSizeX = numCols * platformer.tileSizeX;
        levelSizeY = numRows * platformer.tileSizeY;

        tilemap = world.getTilemap();

        renderlist = {
            tiles : [],
            particles : [],
            items : [],
            entities : []
        };
    }

    this.update = function(){
        // calcul des positions min et max d'affichage entre lesquelles on met à jour les entités
        maxDistance = level.getPlayer().x + level.getPlayer().width / 2 + updateDistance / 2 + platformer.game.getScreenWidth() / 2;
        minDistance = level.getPlayer().x - updateDistance / 2 - platformer.game.getScreenWidth() / 2;

        screenWidth = platformer.game.getScreenWidth();
        screenHeight = platformer.game.getScreenHeight();

        targetPanX = level.getPlayer().x - screenWidth / 2 + level.getPlayer().width / 2;
        targetPanY = level.getPlayer().y - screenHeight / 2 + level.getPlayer().height / 2;

        // test
        panX = lerp(panX, targetPanX, 0.05);
        panY = lerp(panY, targetPanY, 0.05);


        tileAcrossX = parseInt(screenWidth / platformer.tileSizeX + 2);
        tileAcrossY = parseInt(screenHeight / platformer.tileSizeY + 2);


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

        startX = parseInt(panX / platformer.tileSizeX);
        startY = parseInt(panY / platformer.tileSizeY);


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
        * Liste des éléments visibles par le joueur et nécessitant d'être rendu à l'écran
        */
        renderlist = {
            tiles : [],
            particles : [],
            items : [],
            entities : []
        };

        for(var x = startX; x < endX; x++){
            for(var y = startY; y < endY; y++){
                if(typeof tilemap[x][y] !== 'undefined' && !tilemap[x][y].equals(platformer.tiletype.void)){
                    renderlist.tiles.push(tilemap[x][y]);
                }
            }
        }
        renderlist.items = filterObjects(level.getItems());
        renderlist.entities = filterObjects(level.getEntities());
        renderlist.particles = filterObjects(level.getParticles());
    }

    this.render = function(ctx){
        ctx.fillStyle = '#9CC8BB';
        ctx.fillRect(0, 0, platformer.game.getScreenWidth(), platformer.game.getScreenHeight());

        renderObjects(ctx, renderlist.items);
        renderObjects(ctx, renderlist.tiles);
        renderObjects(ctx, renderlist.entities);
        level.getPlayer().render(ctx, panX, panY);
        renderObjects(ctx, renderlist.particles);
    }

    function isVisibleAt(posX, posY){
        var tempX = Math.round(posX / platformer.tileSizeX);
        var tempY = Math.round(posY / platformer.tileSizeY);

        return (tempX >= startX - 1 && tempY >= startY && tempX < endX + 1 && tempY < endY);
    }

    function filterObjects(items){
        // retourne une liste des éléments à afficher et update ceux qui doivent l'être
        var tmp = [];
        for(var k in items){
            // update
            if(typeof items[k] !== 'undefined' && !items[k].isDirty() && items[k].x <= maxDistance && items[k].x >= minDistance){
                items[k].update();

                // render
                if(isVisibleAt(items[k].x, items[k].y)){
                    tmp.push(items[k]);
                }
            }
        }

        return tmp;
    }

    function renderObjects(ctx, items){
        for(var i = 0, n = items.length; i < n; i++){
            items[i].render(ctx, panX, panY);
            //items[i].draw(ctx, panX, panY);
        }
    }

    this.getPanX = function(){ return panX; }
    this.getPanY = function(){ return panY; }
    this.getLevelSizeX = function(){ return levelSizeX; }
    this.getLevelSizeY = function(){ return levelSizeY; }
    this.getTilemap = function(){ return tilemap; }
    this.getNumCols = function(){ return numCols; }
    this.getNumRows = function(){ return numRows; }

    this.getVisibleItems = function(){ return renderlist.items; }
    this.getVisibleTiles = function(){ return renderlist.tiles; }
}
