function WorldGeneration(){
    var seed,
        tilemap,

        numCols,
        numRows,

        cursor;

    this.init = function(){
        if(typeof seed == 'undefined'){
            seed = String(Math.floor(Math.random() * Math.pow(2, 32)));
        }

        // on utilise la seed comme base avec seedrandom
        Math.seedrandom(seed);

        numCols = 30;
        numRows = 20;

        generateTilemap();

        // reset seedrandom
        Math.seedrandom();
    }

    /**
    * Créé un tableau à deux dimensions représentant la tilemap
    */
    function generateTilemap(){
        tilemap = [];

        var i = 0;

        var horizon = numRows - 2; //Math.floor(numRows * 3 / 5);
        var spawnProtection = 5;

        cursor = new Position(spawnProtection, horizon - 2);

        for(var x = 0; x < numCols; x++){
            tilemap[x] = tilemap[x] || [];

            if(i >= numCols){
                i = 0;
                y++;
            }

            for(var y = 0; y < numRows; y++){
                var tiletype = platformer.tiletype.void;

                if(y == numRows - 1){
                    tiletype = platformer.tiletype.test;
                }
                else if(y == numRows - 2){
                    tiletype = platformer.tiletype.spike;
                }

                tilemap[x][y] = new Tile(tiletype, new Position(x, y), 1, 0);
            }
        }

        createPlatform(cursor.x, cursor.y, 10);
        createPlatform(cursor.x + 4, cursor.y - 2, 3);
        createPlatform(cursor.x + 6, cursor.y + 1, 4);
        createPlatform(cursor.x - 3, cursor.y - 3, 2);
    }

    function createPlatform(dx, dy, width){
        for(var x = dx, n = dx + width; x < n; x++){
            if(x >= 0 && dy >= 0 && x < numCols && dy < numRows){
                tilemap[x][dy] = new Tile(platformer.tiletype.test, new Position(x, dy), 1, 0);
            }
        }

        cursor = new Position(dx + width, dy);
    }



    function setMetadata(){

    }

    this.setSeed = function(s){
        seed = String(s).trim();
    }

    this.getNumCols = function(){ return numCols; }
    this.getNumRows = function(){ return numRows; }
    this.getSeed = function(){ return seed; }
    this.getTilemap = function(){ return tilemap; }
}
