function MapObject(level, x, y, width, height){
    Rectangle.call(this, x, y, width, height);

    var self = this;

    var vx = 0,
        vy = 0;

    var gravityForce = 8;

    var blockedLeft = false,
        blockedRight = false,
        blockedUp = false,
        blockedDown = false;

    var falling = false;
    var jumping = false;
    var doubleJumping = false;
    var canDoubleJump = false;
    var canJump = true;

    this.left = false;
    this.right = false;
    this.jump = false;
    this.doubleJump = false;
    this.down = false;
    this.up = false;

    this.property = {
        speed : 0,
        stopSpeed : 0,
        maxSpeed : 0,
        fallSpeed : 0,
        maxFallSpeed : 0,
        jumpHeight : 0,
        doubleJumpHeight : 0
    };

    this.update = function(){
        move();
        collision();
        gravity();

        self.x += platformer.math.toFloat(vx);
        self.y += platformer.math.toFloat(vy);

        fixBounds();
    }

    this.render = function(ctx, panX, panY){
        ctx.fillStyle = 'purple';
        ctx.fillRect(this.x - panX, this.y - panY, this.width, this.height);
    }

    function fixBounds(){
        // correction de la position en fonction des limites de la carte
        var mapSizeX = level.getMap().getLevelSizeX();
        var mapSizeY = level.getMap().getLevelSizeY();

        if(self.x < 0){
            self.x = 0;
            vx = 0;
            blockedLeft = true;
        }
        if(self.y < 0){
            self.y = 0;
            vy = 0;
            blockedUp = true;
        }
        if(self.x + self.width > mapSizeX){
            self.x = mapSizeX - self.width;
            vx = 0;
            blockedRight = true;
        }
        if(self.y + self.height > mapSizeY){
            self.y = mapSizeY - self.height;
            vy = 0;
            blockedDown = true;
        }
    }


    function move(){
        // mouvements horizontaux et verticaux
        if(self.left && !blockedLeft){
            vx -= self.property.speed;
            if(vx < -self.property.maxSpeed){
                vx = -self.property.maxSpeed;
            }
        }
        else{
            if(vx < 0){
                vx += self.property.stopSpeed;
                if(vx > 0){
                    vx = 0;
                }
            }
        }

        if(self.right && !blockedRight){
            vx += self.property.speed;
            if(vx > self.property.maxSpeed){
                vx = self.property.maxSpeed;
            }
        }
        else{
            if(vx > 0){
                vx -= self.property.stopSpeed;
                if(vx < 0){
                    vx = 0;
                }
            }
        }

        /*
        if(self.up && !blockedUp){
            vy -= self.property.speed;
            if(vy < -self.property.maxSpeed){
                vy = -self.property.maxSpeed;
            }
        }
        else{
            if(vy < 0){
                vy += self.property.stopSpeed;
                if(vy > 0){
                    vy = 0;
                }
            }
        }

        if(self.down && !blockedDown){
            vy += self.property.speed;
            if(vy > self.property.maxSpeed){
                vy = self.property.maxSpeed;
            }
        }
        else{
            if(vy > 0){
                vy -= self.property.stopSpeed;
                if(vy < 0){
                    vy = 0;
                }
            }
        }
        */

        if(self.jump){
            vy -= self.property.jumpHeight;
            self.jump = false;
            falling = true;
            jumping = true;
            canDoubleJump = true;
        }

        if(falling){
            if(self.doubleJump){
                vy -= self.property.doubleJumpHeight;
                self.doubleJump = false;
                doubleJumping = true;
            }

            vy += (jumping) ? self.property.fallSpeed / gravityForce : self.property.fallSpeed;

            if(vy > self.property.maxFallSpeed){
                vy = self.property.maxFallSpeed;
            }

            if(vy >= 0){
                doubleJumping = false;
                jumping = false;
                falling = false;
                canJump = true;
            }
        }
    }

    this.setJumping = function(){
        if(!falling && canJump){
            canJump = false;
            this.jump = true;
        }
        if(jumping && canDoubleJump){
            canDoubleJump = false;
            this.doubleJump = true;
        }
    }

    function collision(){
        // gère la collision des objects

        blockedLeft = false;
        blockedRight = false;
        blockedUp = false;
        blockedDown = false;

        var topLeftTile, bottomLeftTile, topRightTile, topBottomTile;

        var destX = self.x + vx;
        var destY = self.y + vy;



        // on vérifie les 4 coins pour voir si le prochain tile est solide ou non et on bloque le player en conséquence
        if(vx < 0){
            // déplacement à gauche
            topLeftTile = getTileAt(destX - 1, self.y + 1);
            bottomLeftTile = getTileAt(destX - 1, self.y + self.height - 1);

            if((typeof topLeftTile !== 'undefined' && topLeftTile.tiletype.solid) || (typeof bottomLeftTile !== 'undefined' && bottomLeftTile.tiletype.solid)){
                blockedLeft = true;
                self.x = topLeftTile.x + platformer.tileSizeX || bottomLeftTile.x + platformer.tileSizeX;
                vx = 0;
            }
        }
        else if(vx > 0){
            // déplacement à droite
            topRightTile = getTileAt(destX + self.width, self.y + 1);
            bottomRightTile = getTileAt(destX + self.width, self.y + self.height - 1);

            if((typeof topRightTile !== 'undefined' && topRightTile.tiletype.solid) || (typeof bottomRightTile !== 'undefined' && bottomRightTile.tiletype.solid)){
                blockedRight = true;
                self.x = topRightTile.x - self.width - 0.1 || bottomRightTile.x - self.width - 0.1;
                vx = 0;
            }
        }

        if(vy < 0){
            // déplacement vers le haut
            topLeftTile = getTileAt(self.x + 1, destY - 1);
            topRightTile = getTileAt(self.x + self.width - 1, destY - 1);

            if((typeof topLeftTile !== 'undefined' && topLeftTile.tiletype.solid) || (typeof topRightTile !== 'undefined' && topRightTile.tiletype.solid)){
                blockedUp = true;
                self.y = topLeftTile.y + platformer.tileSizeY || topRightTile.y - platformer.tileSizeY;
                vy = 0;
            }
        }
        else if(vy > 0){
            // déplacement vers le bas
            bottomLeftTile = getTileAt(self.x + 1, destY + self.height + 1);
            bottomRightTile = getTileAt(self.x + self.width - 1, destY + self.height + 1);

            if((typeof bottomLeftTile !== 'undefined' && bottomLeftTile.tiletype.solid) || (typeof bottomRightTile !== 'undefined' && bottomRightTile.tiletype.solid)){
                blockedDown = true;
                self.y = bottomLeftTile.y - self.height || bottomRightTile.y - self.height;
                vy = 0;
            }
        }
    }

    function gravity(){
        var bottomLeftTile = getTileAt(self.x + 1, self.y + self.height);
        var bottomRightTile = getTileAt(self.x + self.width - 1, self.y + self.height);

        if((typeof bottomLeftTile !== 'undefined' && !bottomLeftTile.tiletype.solid) && (typeof bottomRightTile !== 'undefined' && !bottomRightTile.tiletype.solid)){
            falling = true;
        }
        else{
            falling = false;
        }
    }

    function getTileAt(posX, posY){
        var map = level.getMap();
        var x = parseInt(posX / platformer.tileSizeX, 10);
        var y = parseInt(posY / platformer.tileSizeY, 10);
        return (x >= 0 && x < map.getNumCols() && y >= 0 && y < map.getNumRows()) ? map.getTilemap()[x][y] : undefined;
    }

    this.isBlockedLeft = function(){ return blockedLeft; }
    this.isBlockedRight = function(){ return blockedRight; }
    this.isBlockedUp = function(){ return blockedUp; }
    this.isBlockedDown = function(){ return blockedDown; }

    this.isFalling = function(){ return falling; }
    this.isJumping = function(){ return jumping; }
}
