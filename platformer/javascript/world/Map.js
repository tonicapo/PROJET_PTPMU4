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

        updateDistance = platformer.game.getScreenWidth(),

        minDistance,
        maxDistance,

        player,
        spawn,

        background;


    this.init = function(){
        player = level.getPlayer();

        world = new WorldGeneration(level);
        world.init({ seed : platformer.seed, cols : 500, rows : 20 });


        numCols = world.getNumCols();
        numRows = world.getNumRows();

        levelSizeX = numCols * platformer.tileSizeX;
        levelSizeY = numRows * platformer.tileSizeY;

        tilemap = world.getTilemap();

        spawn = world.getSpawn();
        player.setSpawn(spawn.x, spawn.y);

        // spawn des entités
        var entities = world.getEntities();
        for(var i = 0, n = entities.length; i < n; i++){
            level.spawnEntity(entities[i]);
        }

        renderlist = {
            tiles : [],
            particles : [],
            items : [],
            entities : [],
            loots : []
        };
    }

    this.update = function(){
        // calcul des positions min et max d'affichage entre lesquelles on met à jour les entités
        maxDistance = player.x + player.width / 2 + updateDistance / 2 + platformer.game.getScreenWidth() / 2;
        minDistance = player.x - updateDistance / 2 - platformer.game.getScreenWidth() / 2;

        screenWidth = platformer.game.getScreenWidth();
        screenHeight = platformer.game.getScreenHeight();

        targetPanX = player.x - screenWidth / 2 + player.width / 2;
        targetPanY = player.y - screenHeight / 2 + player.height / 2;

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
            entities : [],
            loots : []
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
        renderlist.loots = filterObjects(level.getLoots());

    }

    this.render = function(ctx){
        renderObjects(ctx, renderlist.items);
        renderObjects(ctx, renderlist.tiles);
        renderObjects(ctx, renderlist.entities);
        player.render(ctx, panX, panY);
        renderObjects(ctx, renderlist.loots);
        renderObjects(ctx, renderlist.particles);
    }

    function isVisibleAt(posX, posY){
        var tempX = Math.round(posX / platformer.tileSizeX);
        var tempY = Math.round(posY / platformer.tileSizeY);

        return (tempX >= startX - 1 && tempY >= startY - 1 && tempX < endX + 1 && tempY < endY + 1);
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
        //renderBox(ctx, player);

        /*
        for(var i in renderlist.entities){
            renderBox(ctx, renderlist.entities[i]);
        }
        */

    }

    function renderBox(ctx, entity){
        if(entity.constructor.name != 'Player'){
            var viewbox = entity.getViewBox();
            ctx.strokeStyle = 'orange';
            ctx.strokeRect(viewbox.x - panX, viewbox.y - panY, viewbox.width, viewbox.height);
            var rangebox = entity.getRangeBox();
            ctx.strokeStyle = 'red';
            ctx.strokeRect(rangebox.x - panX, rangebox.y - panY, rangebox.width, rangebox.height);
        }

        ctx.strokeStyle = 'green';
        ctx.strokeRect(entity.x - panX, entity.y - panY, entity.width, entity.height);
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
    this.getVisibleLoots = function(){ return renderlist.loots; }
}
