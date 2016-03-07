function WorldGeneration(){
    var seed;
    var tilemap;
    var numCols, numRows;

    this.init = function(){
        if(typeof seed == 'undefined'){
            seed = String(Math.floor(Math.random() * Math.pow(2, 32)));
        }

        // on utilise la seed comme base avec seedrandom
        Math.seedrandom(seed);

        numCols = 30;
        numRows = 15;

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

        for(var x = 0; x < numCols; x++){
            tilemap[x] = tilemap[x] || [];

            if(i >= numCols){
                i = 0;
                y++;
            }

            for(var y = 0; y < numRows; y++){
                tilemap[x][y] = new Tile(platformer.tiletype.void, new Position(x, y), 1, 0);

                // temp
                if(
                    (y >= Math.floor(numRows / 2)) ||
                    (y == Math.floor(numRows / 2) - 1 && x % 6 == 0) ||
                    (y == 4 && x == 4) ||
                    (y == 4 && x == 6) ||
                    (y == 2 && (x > 3 && x < 9))
                ){
                    tilemap[x][y] = new Tile(platformer.tiletype.test, new Position(x, y), 1, 0);
                }

            }
        }
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
