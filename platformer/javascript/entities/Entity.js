function Entity(level, position, width, height, renderWidth, renderHeight){
    MapObject.call(this, level, position.x * platformer.tileSizeX, position.y * platformer.tileSizeY, width, height, renderWidth, renderHeight);

    var dead = false;

    this.setDead = function(){
        dead = true;
        vx = 0;
        vy = 0;
        this.left = false;
        this.right = false;
    }

    this.isDead = function(){ return dead; }
}
