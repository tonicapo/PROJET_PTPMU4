function WorldGeneration(level, test){
    if(typeof test === 'undefined'){
        test = false;
    }

    // compteur d'entités
    var kc, ac, bc;

    var seed,
        tilemap,

        numCols,
        numRows,

        cursor,

        spawn,
        entities,

        coinBridges,
        breakableList,

        chest,

        startElevation;

    var spawnProtection = 5;
    var bossRoomProtection = 10;
    var hostileSpawnDistance = 4;

    // paramètres de la carte
    var crateSpawnChance = platformer.difficulty.crateSpawnChance;
    var hostileSpawnRate = platformer.difficulty.hostileSpawnRate;
    var coinBridgeSpawnChance = platformer.difficulty.coinBridgeSpawnChance;
    var bonusChestSpawnChance = platformer.difficulty.bonusChestSpawnChance;
    var archerSpawnChance = platformer.difficulty.archerSpawnChance;
    var bossSpawnChance = platformer.difficulty.bossSpawnChance;

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

    var bossChunkType = {
        minPtWidth : bossRoomProtection,
        maxPtWidth : bossRoomProtection,

        minGpWidth : 0,
        maxGpWidth : 0,

        minElevation : 0,
        maxElevation : 0,

        height : -1,

        decoration : {
            outerLayer : platformer.tiletype.stone,
            innerLayer : platformer.tiletype.stone
        }
    };

    var filledChunkTypeA = {
        minPtWidth : 3,
        maxPtWidth : 9,

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

    var filledChunkTypeB = {
        minPtWidth : 5,
        maxPtWidth : 10,

        minGpWidth : 0,
        maxGpWidth : 0,

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
            outerLayer : platformer.tiletype.brick,
            innerLayer : platformer.tiletype.brick
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
        coinBridges = [];
        breakableList = [];

        seed = (typeof options.seed !== 'undefined') ? options.seed : undefined;
        numCols = (typeof options.cols !== 'undefined') ? parseInt(options.cols, 10) : platformer.difficulty.numCols;
        numRows = (typeof options.rows !== 'undefined') ? parseInt(options.rows, 10) : platformer.difficulty.numRows;

        startElevation = numRows - 6;

        if(typeof seed == 'undefined'){
            seed = String(Math.floor(Math.random() * Math.pow(2, 32)));
        }
        platformer.seed = seed;

        // on utilise la seed comme base avec seedrandom
        Math.seedrandom(seed);

        spawn = new Position(0, 0);

        entities = [];

        kc = 0;
        ac = 0;
        bc = 0;

        // génération d'une tilemap
        generateTilemap();
        // génération des plateformes et du terrain
        generateTerrain();
        // ajouts de tiles NON structurelles (type décoration, herbes, fleurs etc..)
        decorateWorld();
        // sélection de textures aléatoire parmis la liste disponible pour chaque tiletype
        randomizeMetadata();
        // ajout des caisses de bonus
        addCrates();
        // ajout de plateforme entre les zones longues de terrain
        addBonusPlatform();
        // ajout le coffre de fin sur la dernière plateforme
        addChest();
        // génère des ponts de pièces entre les fosses
        createCoinBridges();
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
        var type;
        var prevType;

        while(cx < numCols){
            var offset;
            prevType = type;

                if(cx == 0){
                    type = spawnChunkType;
                }
                else{
                    var rand;

                    rand = Math.random();

                    if(rand > 0.65){
                        type = filledChunkTypeA;
                    }
                    else{
                        type = platformChunkType;
                    }

                    rand = Math.random();

                    if(prevType == filledChunkTypeA && rand > 0.8){
                        type = filledChunkTypeB;
                    }
                }


            offset = createStructure(cx, type);

            size += offset;
            cx += offset;
        }

        spawn.x = randomInt(2, spawnProtection - 1);
        spawn.y = getPlatformNiv(spawn.x);
    }

    function decorateWorld(){
        var startlvl = getPlatformNiv(0) + 1;

        for(var x = 0; x < numCols; x++){
            // ajout de pics si il en manque
            if(x >= numCols - bossRoomProtection){
                var lastTile = getTileAtCoord(x, numRows - 1);
                if(typeof lastTile !== 'undefined' && !lastTile.tiletype.solid){
                    lastTile.tiletype = platformer.tiletype.spike;
                }
            }

            // ajout de décorations diverses sur les plateformes
            for(var y = 0; y < numRows; y++){
                var tile = getTileAtCoord(x, y);
                var tileTop = getTileAtCoord(x, y - 1);
                var tileUnder = getTileAtCoord(x, y + 1);
                var tileLeft = getTileAtCoord(x - 1, y);
                var tileRight = getTileAtCoord(x + 1, y);

                if(typeof tile !== 'undefined'){
                    // porte + chateau au spawn
                    if(x == 0 || x == 1){
                        if(y < startlvl){
                            if((x == 0 && y < startlvl - 2) || x == 1){
                                tile.tiletype = platformer.tiletype.stone;
                            }
                            else{
                                tile.tiletype = platformer.tiletype.door;
                                if(y == startlvl - 1){
                                    tile.metadata = 0;
                                }
                                else if(y == startlvl - 2){
                                    tile.metadata = 1;
                                }
                            }
                        }
                    }

                    // bords des plateformes
                    if(tile.equals(platformer.tiletype.grass)){
                        if(typeof tileTop !== 'undefined'){
                            var tileOver = getTileAtCoord(x, y - 2);
                            if(typeof tileOver !== 'undefined' && tileOver.equals(platformer.tiletype.void)){
                                tileTop.tiletype = platformer.tiletype.grassClump;
                            }
                        }
                        if(typeof tileUnder !== 'undefined'){

                        }
                        if(typeof tileLeft !== 'undefined'){
                            if(tileLeft.equals(platformer.tiletype.void)){
                                tileLeft.tiletype = platformer.tiletype.grassEdge;
                                tileLeft.metadata = 0;
                            }
                        }
                        if(typeof tileRight !== 'undefined'){
                            if(tileRight.equals(platformer.tiletype.void)){
                                tileRight.tiletype = platformer.tiletype.grassEdge;
                                tileRight.metadata = 1;
                            }
                        }
                    }
                    /*
                    else if(tile.equals(platformer.tiletype.brick)){
                        if(typeof tileUnder !== 'undefined'){
                            if(tileUnder.equals(platformer.tiletype.void)){
                                tileUnder.tiletype = platformer.tiletype.brickUnder;
                            }
                        }
                    }
                    */
                }
            }
        }
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
                    var rand = Math.random();
                    var crateType;

                    if(rand > 0.25){
                        crateType = PotionCrate;
                    }
                    else{
                        crateType = WeaponCrate;
                    }

                    var crate = new crateType(level, new Position(x, niv));
                    crate.replacementTiletype = tilemap[x][niv].tiletype;
                    breakableList.push(crate);

                    tilemap[x][niv] = crate;
                    x += 6;
                }
            }
        }
    }

    function addHostiles(){
        for(var x = spawnProtection; x < numCols - bossRoomProtection; x++){
            var niv = getPlatformNiv(x);
            var bottomTile = getTileAtCoord(x, niv + 1);

            if(typeof bottomTile !== 'undefined' && !bottomTile.isBreakable() && niv < numRows - 2 && entityCanMoveAt(x, niv)){
                var rand = Math.random();

                if(rand > 1 - hostileSpawnRate){
                    var entity;
                    var rand = Math.random();

                    entity = new Knight(level, getPositionAtCoord(x, niv));

                    if(rand > 1 - bossSpawnChance){
                        entity = new Boss(level, getPositionAtCoord(x, niv));
                    }
                    else if(rand > 1 - archerSpawnChance){
                        entity = new Archer(level, getPositionAtCoord(x, niv));
                    }


                    if(entity.constructor.name == 'Knight') kc++;
                    if(entity.constructor.name == 'Boss') bc++;
                    if(entity.constructor.name == 'Archer') ac++;

                    entities.push(entity);

                    x += hostileSpawnDistance;
                }
            }
        }

        //platformer.notify('Knight : ' + kc + ', Archer : ' + ac + ', Boss : ' + bc);
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
        if(x >= 0 && x < numCols && y >= 0 && y < numRows){
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
            if(gpWidth > 0 && n > spawnProtection && n < numCols - bossRoomProtection) coinBridges.push({ start : startX - 1, end :  startX + gpWidth });

            return ptWidth + gpWidth;
        }
        return 1;
    }

    // ajout des ponts de pièce entre les trous
    function createCoinBridges(){
        for(var i = 0, n = coinBridges.length; i < n; i++){
            if(Math.random() > 1 - coinBridgeSpawnChance){
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
    }

    function addBonusPlatform(){
        for(var x = spawnProtection; x < numCols - bossRoomProtection; x++){
            var niv = getPlatformNiv(x);

            if(niv < numRows - 2){
                var rand = Math.random();
                var size = getPlatformWidth(niv, x);

                if(rand > 1 - bonusChestSpawnChance && size > 6){
                    var position = randomInt(x + 1, x + size);
                    var width = randomInt(1, 5);

                    for(var i = position, n = position + width; i < n; i++){
                        var crate = new CoinCrate(level, new Position(i, niv - 2));
                        crate.replacementTiletype = tilemap[x][niv - 2].tiletype;
                        breakableList.push(crate);
                        tilemap[i][niv - 2] = crate;

                        if(typeof tilemap[i][niv - 1] !== 'undefined'){
                            tilemap[i][niv - 1].setBreakable(false);
                        }
                    }
                }

                x += size;
            }
        }
    }

    function addChest(){
        var niv;
        var locations = [];

        for(var x = spawnProtection; x < numCols; x++){
            niv = getPlatformNiv(x);
            if(niv != numRows - 1){
                var width = getPlatformWidth(niv, x);
                var xPos = Math.floor((x + x + width) / 2);

                locations.push(getTileAtCoord(xPos, getPlatformNiv(xPos)));
                x += width;
            }
        }

        chest = locations[locations.length - 1];

        if(typeof chest !== 'undefined'){
            chest.tiletype = platformer.tiletype.chest;
            chest.metadata = 0;
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
    this.getBreakableTiles = function(){ return breakableList; }
    this.getChest = function(){ return chest; }
}
