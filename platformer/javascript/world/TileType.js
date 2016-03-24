function TileType(name, textures, solid, randomMetadata){
    this.name = name || '';
    this.solid = solid || false;
    this.textures = textures || [];
    this.randomMetadata = (typeof randomMetadata !== 'undefined') ? randomMetadata : true;
}
