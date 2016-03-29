function MapObject(level, x, y, width, height, animated){
    if(typeof animated === 'undefined' || !animated){
        Rectangle.call(this, x, y, width, height);
    }
    else{
        AnimatedObject.call(this, x, y, width, height);
    }

    var DIRECTION_LEFT = 0;
    var DIRECTION_RIGHT = 1;
    var DIRECTION_UP = 2;
    var DIRECTION_DOWN = 3;

    var self = this,

        vx = 0,
        vy = 0,

        gravityForce = 8,

        blockedLeft = false,
        blockedRight = false,
        blockedUp = false,
        blockedDown = false,

        falling = false,
        jumping = false,
        doubleJumping = false,

        canJump = true,
        canFall = true,

        direction = 0,

        boundToMap = true,

        hitBoxWidth,
        hitBoxHeight,

        moveDisabled = false,

        bonus = {
            speed : 1,
            strength : 1,
            resistance : 1
        },

        reduction = { x : 1, y : 1 };

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
        this.updateMovement();
        this.updateObject();
    }

    this.updateMovement = function(){
        move();
        collision();
        gravity();

        self.x += toFloat(vx) * reduction.x;
        self.y += toFloat(vy) * reduction.y;

        if(boundToMap) fixBounds();
    }

    this.render = function(ctx, panX, panY){
        var renderBox = this.getRenderBox();
        var posX = (direction == 0) ? (renderBox.x + renderBox.width - panX) * -1 : renderBox.x - panX;

        ctx.save();
        ctx.scale((direction == 0) ? -1 : 1, 1);
        ctx.drawImage(this.getTexture(), posX, renderBox.y - panY, renderBox.width, renderBox.height);
        ctx.restore();
    }

    this.draw = function(ctx, panX, panY){
        ctx.strokeStyle = this.getColor();
        ctx.strokeRect(this.x - panX, this.y - panY, this.width, this.height);
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
            //self.y = 0;
            //vy = 0;
            //blockedUp = true;
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
        if(self.left && !blockedLeft && !moveDisabled){
            vx -= self.property.speed;
            if(vx < -self.property.maxSpeed * self.getBonus('speed')){
                vx = -self.property.maxSpeed * self.getBonus('speed');
            }
        }
        else{
            if(vx < 0){
                vx += self.property.stopSpeed;
                if(vx > 0){
                    vx = 0;
                    self.left = false;
                }
            }
        }

        if(self.right && !blockedRight && !moveDisabled){
            vx += self.property.speed;
            if(vx > self.property.maxSpeed * self.getBonus('speed')){
                vx = self.property.maxSpeed * self.getBonus('speed');
            }
        }
        else{
            if(vx > 0){
                vx -= self.property.stopSpeed;
                if(vx < 0){
                    vx = 0;
                    self.right = false;
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
                //doubleJumping = false;
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
            topLeftTile = self.getTileAt(destX - 1, self.y + 1);
            bottomLeftTile = self.getTileAt(destX - 1, self.y + self.height - 1);

            if((typeof topLeftTile !== 'undefined' && topLeftTile.tiletype.solid) || (typeof bottomLeftTile !== 'undefined' && bottomLeftTile.tiletype.solid)){
                blockedLeft = true;
                self.x = topLeftTile.x + platformer.tileSizeX || bottomLeftTile.x + platformer.tileSizeX;
                vx = 0;
            }
        }
        else if(vx > 0){
            // déplacement à droite
            topRightTile = self.getTileAt(destX + self.width, self.y + 1);
            bottomRightTile = self.getTileAt(destX + self.width, self.y + self.height - 1);

            if((typeof topRightTile !== 'undefined' && topRightTile.tiletype.solid) || (typeof bottomRightTile !== 'undefined' && bottomRightTile.tiletype.solid)){
                blockedRight = true;
                self.x = topRightTile.x - self.width - 0.1 || bottomRightTile.x - self.width - 0.1;
                vx = 0;
            }
        }

        if(vy < 0){
            // déplacement vers le haut
            topLeftTile = self.getTileAt(self.x + 1, destY - 1);
            topRightTile = self.getTileAt(self.x + self.width - 1, destY - 1);

            if((typeof topLeftTile !== 'undefined' && topLeftTile.tiletype.solid) || (typeof topRightTile !== 'undefined' && topRightTile.tiletype.solid)){
                blockedUp = true;

                if(self.constructor.name == 'Player'){
                    var centerTile = self.getTileAt(self.x + self.width / 2, destY - 1);

                    if(typeof centerTile !== 'undefined' && centerTile.equals(platformer.tiletype.crate)){
                        centerTile.break();
                    }
                }

                self.y = topLeftTile.y + platformer.tileSizeY || topRightTile.y - platformer.tileSizeY;
                vy = 0;
            }
        }
        else if(vy > 0){
            // déplacement vers le bas
            bottomLeftTile = self.getTileAt(self.x + 1, destY + self.height + 1);
            bottomRightTile = self.getTileAt(self.x + self.width - 1, destY + self.height + 1);

            if((typeof bottomLeftTile !== 'undefined' && bottomLeftTile.tiletype.solid) || (typeof bottomRightTile !== 'undefined' && bottomRightTile.tiletype.solid)){
                blockedDown = true;
                self.y = bottomLeftTile.y - self.height || bottomRightTile.y - self.height;
                vy = 0;
            }
        }
    }

    function gravity(){
        if(!canFall){
            return;
        }
        var bottomLeftTile = self.getTileAt(self.x + 1, self.y + self.height);
        var bottomRightTile = self.getTileAt(self.x + self.width - 1, self.y + self.height);

        if((typeof bottomLeftTile !== 'undefined' && !bottomLeftTile.tiletype.solid) && (typeof bottomRightTile !== 'undefined' && !bottomRightTile.tiletype.solid)){
            falling = true;
        }
        else{
            falling = false;
        }
    }

    this.getTileAt = function(posX, posY){
        var map = level.getMap();
        var x = parseInt(posX / platformer.tileSizeX, 10);
        var y = parseInt(posY / platformer.tileSizeY, 10);
        return (!(x < 0 || x >= map.getNumCols() || y < 0 || y >= map.getNumRows())) ? map.getTilemap()[x][y] : undefined;
    }

    // setters

    this.setDirection = function(d){
        direction = d;
    }

    this.setReduction = function(x, y){
        reduction.x = x;
        reduction.y = y;
    }

    this.addVector = function(x, y){
        vx += x;
        vy += y;
    }

    this.setVector = function(x, y, smooth){
        if(smooth === true){
            vx = lerp(x, vx, 0.5);
            vy = lerp(y, vy, 0.5);
        }
        else{
            vx = x;
            vy = y;
        }
    }

    this.setDoubleJumping = function(d){
        doubleJumping = d;
    }

    /**
    * Hit box
    */
    this.setHitBox = function(width, height){
        hitBoxWidth = width;
        hitBoxHeight = height;
    }
    this.getHitBox = function(){
        var offsetX = this.width / 2 - hitBoxWidth / 2;
        var offsetY = this.height / 2 - hitBoxHeight / 2;

        return new Rectangle(this.x + offsetX, this.y + offsetY, hitBoxWidth, hitBoxHeight);
    }

    this.setDimension = function(w, h){
        this.width = w;
        this.height = h;
    }

    this.setBoundToMap = function(b){
        boundToMap = b;
    }

    /**
    * BONUS
    * ajoute un bonus à l'entité
    */
    this.setBonus = function(name, factor, delay){
        if(typeof bonus[name] === 'undefined' || typeof delay === 'undefined' || typeof factor === 'undefined'){
            return;
        }

        if(factor < 1){
            factor = 1;
        }


        bonus[name] = factor;
        if(delay != -1){
            // timer pour remettre le bonus à la normale une fois le délais dépassé
            level.getTimers().addTimer(function(){
                bonus[name] = 1;
            }, delay);
        }

    }
    this.getBonus = function(name){
        return bonus[name];
    }

    this.getEachBonus = function(){
        return bonus;
    }
    
    // getters
    this.isBlockedLeft = function(){ return blockedLeft; }
    this.isBlockedRight = function(){ return blockedRight; }
    this.isBlockedUp = function(){ return blockedUp; }
    this.isBlockedDown = function(){ return blockedDown; }

    this.isFalling = function(){ return falling; }
    this.isJumping = function(){ return jumping; }
    this.isDoubleJumping = function(){ return doubleJumping; }

    this.enableGravity = function(b){
        canFall = b;
    }
    this.canFall = function(){ return canFall; }
    this.disableMovement = function(b){ moveDisabled = b; }
    this.isMovementDisabled = function(){ return moveDisabled; }

    this.getDirection = function(){ return direction; }

    this.getVector = function(){ return { x : vx, y : vy } }
}
