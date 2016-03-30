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

        updateDistance,

        minDistance,
        maxDistance,

        player,
        spawn,

        background,

        breakableTiles,

        chest,
        entitiesCount;


    this.init = function(){
        player = level.getPlayer();

        world = new WorldGeneration(level, false);
        world.init({ seed : platformer.seed });


        numCols = world.getNumCols();
        numRows = world.getNumRows();

        levelSizeX = numCols * platformer.tileSizeX;
        levelSizeY = numRows * platformer.tileSizeY;

        tilemap = world.getTilemap();

        spawn = world.getSpawn();
        player.setSpawn(spawn.x, spawn.y);

        // arme par défaut
        if(platformer.difficulty != platformer.mode.peaceful){
            level.spawnLoot(new SwordItem(level, getPositionAtCoord(spawn.x + 1, spawn.y)));
        }

        breakableTiles = world.getBreakableTiles();

        chest = world.getChest();

        // spawn des entités
        var entities = world.getEntities();
        entitiesCount = entities.length;

        for(var i = 0; i < entitiesCount; i++){
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
        updateCamera();
        /**
        * Renderlist
        * Liste des éléments visibles par le joueur et nécessitant d'être rendu à l'écran
        */
        filterTiles();
        filterObjects('items', level.getItems());
        filterObjects('entities', level.getEntities());
        filterObjects('particles', level.getParticles());
        filterObjects('loots', level.getLoots(), true);
    }

    this.render = function(ctx){
        renderObjects(ctx, renderlist.tiles);
        renderObjects(ctx, renderlist.entities);
        player.render(ctx, panX, panY);
        renderObjects(ctx, renderlist.items);
        renderObjects(ctx, renderlist.loots, true);
        renderObjects(ctx, renderlist.particles);
    }

    function isVisibleAt(posX, posY){
        var tempX = Math.round(posX / platformer.tileSizeX);
        var tempY = Math.round(posY / platformer.tileSizeY);

        return !(tempX < startX || tempY < startY - 1 || tempX > endX || tempY > endY);
    }

    function filterTiles(){
        delete renderlist.tiles;
        renderlist.tiles = [];

        for(var x = startX; x < endX; x++){
            for(var y = startY; y < endY; y++){
                if(!(typeof tilemap[x][y] === 'undefined' || tilemap[x][y].equals(platformer.tiletype.void))){
                    renderlist.tiles.push(tilemap[x][y]);
                }
            }
        }
    }

    /**
    * Purge les objects du niveau qui sont marqué comme obsolètes et gère la renderlist / update
    */
    function filterObjects(filter, items, animate){
        // recréé une liste des éléments à afficher et update ceux qui doivent l'être
        delete renderlist[filter];
        renderlist[filter] = [];

        for(var k in items){
            if(items[k].isDirty()){
                items[k] = null;
                delete items[k];
            }
            else{
                // update
                if(!(typeof items[k] === 'undefined' || items[k].x > maxDistance || items[k].x < minDistance)){
                    items[k].update();

                    // render
                    if(isVisibleAt(items[k].x, items[k].y)){
                        renderlist[filter].push(items[k]);
                    }
                }
                else{
                    // animations des objets distants si elles doivent rester synchrones
                    if(typeof items[k] !== 'undefined' && animate){
                        items[k].updateObject();
                    }

                    /*
                    * optimisation
                    */
                    if(filter == 'entities' && items[k].isDead()){
                        items[k] = null;
                        delete items[k];
                    }
                    else if(filter == 'particles'){
                        items[k] = null;
                        delete items[k];
                    }
                }
            }
        }
    }

    function renderObjects(ctx, items){
        for(var i = 0, n = items.length; i < n; i++){
            items[i].render(ctx, panX, panY);
            //items[i].draw(ctx, panX, panY);
        }

        /*
        renderBox(ctx, player);
        for(var i in renderlist.entities){
            renderBox(ctx, renderlist.entities[i]);
        }

        */

    }

    function updateCamera(){
        updateDistance = platformer.game.getScreenWidth();

        // calcul des positions min et max d'affichage entre lesquelles on met à jour les entités
        maxDistance = player.x + player.width / 2 + updateDistance;
        minDistance = player.x - updateDistance;

        screenWidth = platformer.game.getScreenWidth();
        screenHeight = platformer.game.getScreenHeight();

        targetPanX = player.x - screenWidth / 2 + player.width / 2;
        targetPanY = player.y - screenHeight / 2 + player.height / 2;

        if(panX == 0) panX = targetPanX;
        if(panY == 0) panY = targetPanY;

        // test
        panX = parseInt(lerp(panX, targetPanX, 0.075), 10);
        panY = parseInt(lerp(panY, targetPanY, 0.025), 10);


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

        startX = parseInt(panX / platformer.tileSizeX) - 1;
        startY = parseInt(panY / platformer.tileSizeY) - 1;


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

        endX = startX + tileAcrossX + 1;
        endY = startY + tileAcrossY + 1;

        if(endX > numCols){
            endX = numCols;
        }
        if(endY > numRows){
            endY = numRows;
        }
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
    this.getEntitiesCount = function(){ return entitiesCount; }

    this.getVisibleItems = function(){ return renderlist.items; }
    this.getVisibleTiles = function(){ return renderlist.tiles; }
    this.getVisibleLoots = function(){ return renderlist.loots; }
    this.getVisibleEntities = function(){ return renderlist.entities; }
    this.getBreakableTiles = function(){ return breakableTiles; }

    this.getChest = function(){ return chest; }
}
