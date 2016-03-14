function Coin(level, point){
    Loot.call(this, level, point);

    this.setTexture(platformer.textures.items.coin[0]);
    this.setHitBox(11 * platformer.scale, 10 * platformer.scale);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);
}
