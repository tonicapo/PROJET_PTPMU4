function WorldGeneration(level, test){
    if(typeof test === 'undefined'){
        test = false;
    }

    var seed,
        tilemap,

        numCols,
        numRows,

        cursor,

        spawn,
        entities,

        coinBridges = [];

    var crateSpawnChance = 0.035;
    var spawnProtection = 5;
    var bossRoomProtection = 10;
    var hostileSpawnRate = 0; //0.2
    var hostileSpawnDistance = 4;
    var coinBridgeSpawnChance = 1;
    var bonusChestSpawnChance = 0.15;
    var startElevation;

    var spawnChunkType = {
        minPtWidth : 5,
        maxPtWidth : 5,

        minGpWidth : 0,
        maxGpWidth : 0,

        minElevation : 0,
        maxElevation : 0,

        height : -1,

        decoration : {
            outerLayer : platformer.tiletype.grass,
            innerLayer : platformer.tiletype.dirt
        }
    };

    var filledChunkTypeA = {
        minPtWidth : 3,
        maxPtWidth : 14,

        minGpWidth : 3,
        maxGpWidth : 6,

        minElevation : -3,
        maxElevation : 2,

        height : -1,

        decoration : {
            outerLayer : platformer.tiletype.grass,
            innerLayer : platformer.tiletype.dirt
        }
    };


    var platformChunkType = {
        minPtWidth : 1,
        maxPtWidth : 8,

        minGpWidth : 4,
        maxGpWidth : 6,

        minElevation : -3,
        maxElevation : 2,

        height : 1,

        decoration : {
            outerLayer : platformer.tiletype.stone,
            innerLayer : platformer.tiletype.stone
        }
    };

    var testWorldChunkType = {
        minPtWidth : 10,
        maxPtWidth : 10,

        minGpWidth : 0,
        maxGpWidth : 0,

        minElevation : 0,
        maxElevation : 0,

        height : -1,

        decoration : {
            outerLayer : platformer.tiletype.grass,
            innerLayer : platformer.tiletype.dirt
        }
    };

    this.init = function(options){
        seed = (typeof options.seed !== 'undefined') ? options.seed : undefined;
        numCols = (typeof options.cols !== 'undefined') ? parseInt(options.cols, 10) : 400;
        numRows = (typeof options.rows !== 'undefined') ? parseInt(options.rows, 10) : 20;

        startElevation = numRows - 6;

        if(typeof seed == 'undefined'){
            seed = String(Math.floor(Math.random() * Math.pow(2, 32)));
        }
        platformer.seed = seed;

        // on utilise la seed comme base avec seedrandom
        Math.seedrandom(seed);

        spawn = new Position(0, 0);

        entities = [];

        // génération d'une tilemap
        generateTilemap();
        // génération des plateformes et du terrain
        generateTerrain();
        // génère des ponts de pièces entre les fosses
        createCoinBridges();
        // ajouts de tiles NON structurelles (type décoration, herbes, fleurs etc..)
        decorateWorld();
        // sélection de textures aléatoire parmis la liste disponible pour chaque tiletype
        randomizeMetadata();
        // ajout des caisses de bonus
        addCrates();
        // ajout de plateforme entre les zones longues de terrain
        addBonusPlatform();
        // ajout des enemis
        addHostiles();

        // reset seedrandom
        Math.seedrandom();
    }


    /**
    * Créé un tableau à deux dimensions représentant la tilemap
    */
    function generateTilemap(){
        tilemap = [];

        var i = 0;

        for(var x = 0; x < numCols; x++){
            tilemap[x] = tilemap[x] || [];

            if(i >= numCols){
                i = 0;
                y++;
            }

            for(var y = 0; y < numRows; y++){
                var tiletype = platformer.tiletype.void;
                tilemap[x][y] = new Tile(level, tiletype, new Position(x, y), 1, 0);
            }
        }
    }

    function generateTerrain(){
        var cx = 0;
        var size = 0;

        while(cx < numCols){
            var offset;
            if(test){
                offset = createStructure(cx, testWorldChunkType);
            }
            else{
                if(cx == 0){
                    offset = createStructure(cx, spawnChunkType);
                }
                else{
                    var rand = Math.random();
                    if(rand > 0.5){
                        offset = createStructure(cx, filledChunkTypeA);
                    }
                    else{
                        offset = createStructure(cx, platformChunkType);
                    }
                }
            }
            size += offset;
            cx += offset;
        }

        spawn.x = randomInt(1, spawnProtection);
        spawn.y = getPlatformNiv(spawn.x) - 1;
    }

    function decorateWorld(){

    }


    function randomizeMetadata(){
        for(var x = 0; x < numCols; x++){
            for(var y = 0; y < numRows; y++){
                var tiletype = tilemap[x][y].tiletype;
                if(tiletype.randomMetadata){
                    tilemap[x][y].metadata = (tiletype.textures.length > 0) ? randomInt(0, tiletype.textures.length) : 0;
                }
            }
        }
    }

    function addCrates(){
        for(var x = spawnProtection; x < numCols - bossRoomProtection; x++){
            var niv = getPlatformNiv(x);

            var isSolidLeft = isTileSolid(x - 1, niv + 1);
            var isSolidRight = isTileSolid(x + 1, niv + 1);

            if(niv < numRows - 2 && (isSolidLeft && isSolidRight)){
                var rand = Math.random();
                if(crateSpawnChance > 1 - rand){
                    tilemap[x][niv] = new PotionCrate(level, new Position(x, niv));
                }
            }
        }
    }

    function addHostiles(){
        var k = 0;

        for(var x = spawnProtection; x < numCols - bossRoomProtection; x++){
            var niv = getPlatformNiv(x);
            var bottomTile = getTileAtCoord(x, niv + 1);

            if(typeof bottomTile !== 'undefined' && !bottomTile.isBreakable() && niv < numRows - 2 && entityCanMoveAt(x, niv)){
                if(x == 10){
                    entities.push(new Boss(level, getPositionAtCoord(x, niv - 2)));
                }
                var rand = Math.random();

                if(rand > 1 - hostileSpawnRate){
                    var entity;
                    var rand = Math.random();
                    if(rand > 0.75){
                        entity = new Archer(level, getPositionAtCoord(x, niv - 1));
                    }
                    else{
                        entity = new Knight(level, getPositionAtCoord(x, niv - 1));
                    }

                    entities.push(entity);

                    x += hostileSpawnDistance;
                    k++;
                }
            }
        }
    }


    function entityCanMoveAt(x, y){
        var canMoveLeft = entityCanMoveOnTile(x - 1, y);
        var canMoveRight = entityCanMoveOnTile(x + 1, y);

        return (canMoveLeft || canMoveRight);
    }

    function entityCanMoveOnTile(x, y){
        var isblocked = isTileSolid(x, y);
        var canmove = isTileSolid(x, y + 1);
        return (!isblocked && canmove);
    }

    function isTileSolid(x, y){
        var tile = getTileAtCoord(x, y);

        return (typeof tile !== 'undefined' && tile.tiletype.solid);
    }

    function getTileAtCoord(x, y){
        var tile;
        if(x > 0 && x < numCols && y > 0 && y < numRows){
            tile = tilemap[x][y];
        }
        return tile;
    }

    function createStructure(startX, type){
        var ptWidth = randomInt(type.minPtWidth, type.maxPtWidth);
        var gpWidth = randomInt(type.minGpWidth, type.maxGpWidth);
        var elevation = randomInt(type.minElevation, type.maxElevation);

        var niv = startElevation + elevation;
        var prevNiv = (startX > 0) ? getPlatformNiv(startX - 1) : niv;

        // empêche le terrain d'être trop élevé ou inaccessible
        if(Math.abs(niv - prevNiv) > 2){
            niv = prevNiv + 2;
        }
        if(niv > prevNiv && gpWidth > 4){
            niv = prevNiv;
        }

        // hauteur de la plateforme
        var height = (type.height == -1) ? numRows - niv : type.height;


        // position finale du "curseur"
        var n = startX + ptWidth + gpWidth;

        if(n < numCols){
            for(var x = startX; x < n; x++){
                for(var y = 0; y < numRows; y++){
                    var tiletype = platformer.tiletype.void;

                    if(x >= startX && x < startX + gpWidth){
                        if(y == numRows - 1){
                            tiletype = platformer.tiletype.spike;
                        }
                    }
                    else{
                        if(y == niv){
                            tiletype = type.decoration.outerLayer;
                        }
                        else if(y > niv && y < niv + height){
                            tiletype = type.decoration.innerLayer;
                        }
                        else if(y == numRows - 1){
                            tiletype = platformer.tiletype.spike;
                        }
                    }

                    tilemap[x][y].tiletype = tiletype;
                }
            }
            if(gpWidth > 0) coinBridges.push({ start : startX - 1, end :  startX + gpWidth });

            return ptWidth + gpWidth;
        }
        return 1;
    }

    // ajout des ponts de pièce entre les trous
    // TODO : améliorer le code et l'agencement des pièces
    function createCoinBridges(){
        for(var i = 0, n = coinBridges.length; i < n; i++){
            var startX = coinBridges[i].start;
            var endX = coinBridges[i].end;

            var startLevel = getPlatformNiv(startX);
            var endLevel = getPlatformNiv(endX);


            var elevation = startLevel - endLevel;
            var index = 0;

            for(var x = startX + 2, y = 0; x < endX - 1; x++){
                if(startLevel < endLevel){
                    y = startLevel + index;
                }
                else if(startLevel > endLevel){
                    y = startLevel - index;
                }
                else{
                    y = startLevel;
                }


                var position = getPositionAtCoord(x, y - 2);

                level.spawnLoot(new Coin(level, new Position(position.x + platformer.tileSizeX / 2, position.y + platformer.tileSizeX / 2), -1, false));

                if(index < 1){
                    index++
                }
            }
        }
    }

    function addBonusPlatform(){
        for(var x = spawnProtection; x < numCols - bossRoomProtection; x++){
            var niv = getPlatformNiv(x);

            if(niv < numRows - 2){
                var rand = Math.random();
                var size = getPlatformWidth(niv, x);

                if(rand > 1 - bonusChestSpawnChance && size > 6){
                    var position = randomInt(x + 1, x + size);
                    var width = randomInt(1, 2);

                    for(var i = position, n = position + width; i < n; i++){
                        tilemap[i][niv - 2] = new CoinCrate(level, new Position(i, niv - 2));
                    }
                }

                x += size;
            }
        }
    }

    // permet de connaitre la taille d'une plateforme à la position donnée
    function getPlatformWidth(niv, startPos){
        var size = 0;
        for(var i = startPos; i < numCols; i++){
            if(getPlatformNiv(i) != niv){
                break;
            }
            size++;
        }

        return size;
    }

    // retourne la hauteur du terrain solide
    function getPlatformNiv(x){
        var niv = numRows - 1;

        if(x < 0){
            x = 0;
        }
        if(x > numCols){
            x = numCols;
        }

        for(var y = 0; y < numRows; y++){
            try{
                var tile = tilemap[x][y];
                if(typeof tile !== 'undefined' && tile.tiletype.solid){
                    niv = y - 1;
                    break;
                }
            }catch(e){}
        }

        return niv;
    }


    this.setSeed = function(s){
        seed = String(s).trim();
    }

    this.getNumCols = function(){ return numCols; }
    this.getNumRows = function(){ return numRows; }
    this.getSeed = function(){ return seed; }
    this.getTilemap = function(){ return tilemap; }
    this.getSpawn = function(){ return spawn; }
    this.getEntities = function(){ return entities; }
}
