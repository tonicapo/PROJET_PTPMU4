function Tile(tiletype, position, opacity, metadata){
    Rectangle.call(this, position.x * platformer.tileSizeX, position.y * platformer.tileSizeY, platformer.tileSizeX, platformer.tileSizeY);

    this.tiletype = tiletype;
    this.position = position;
    this.opacity = opacity || 0;
    this.metadata = metadata || 0;

    this.equals = function(tiletype){
        return (this.tiletype.name == tiletype.name);
    }

    this.render = function(ctx, panX, panY){
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.tiletype.textures[this.metadata], this.x - panX, this.y - panY, this.width, this.height);
        ctx.restore();
    }

    this.draw = function(ctx, panX, panY){
        ctx.save();
        ctx.globalAlpha = this.opacity;

        var color = (this.tiletype.solid) ? '#505050' : '#dadada';

        ctx.fillStyle = color;
        ctx.fillRect(this.x - panX, this.y - panY, this.width, this.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.strokeRect(this.x - panX, this.y - panY, this.width, this.height);
        
        ctx.restore();
    }
}
