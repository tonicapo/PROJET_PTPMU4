function Entity(level, position, width, height){
    MapObject.call(this, level, position.x * platformer.tileSizeX, position.y * platformer.tileSizeY, width, height);

}
