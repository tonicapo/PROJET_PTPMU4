function Tile(level, tiletype, position, opacity, metadata){
    Rectangle.call(this, position.x * platformer.tileSizeX, position.y * platformer.tileSizeY, platformer.tileSizeX, platformer.tileSizeY);

    this.tiletype = tiletype;
    this.position = position;
    this.opacity = opacity;
    this.metadata = metadata;

    var breakable = false;
    var broken = false;

    this.equals = function(tiletype){
        return (this.tiletype.name == tiletype.name);
    }

    this.render = function(ctx, panX, panY){
        //ctx.save();
        //ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.tiletype.textures[this.metadata], Math.floor(this.x - panX), Math.floor(this.y - panY), this.width, this.height);
        //ctx.restore();
    }

    this.draw = function(ctx, panX, panY){
        ctx.save();
        //ctx.globalAlpha = this.opacity;

        //var color = (this.tiletype.solid) ? '#505050' : '#dadada';

        //ctx.fillStyle = color;
        //ctx.fillRect(this.x - panX, this.y - panY, this.width, this.height);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.strokeRect(this.x - panX, this.y - panY, this.width, this.height);

        ctx.restore();
    }

    this.setBreakable = function(b){
        breakable = b;
    }
    this.setBroken = function(b){
        broken = b;
    }

    this.isBroken = function(){ return broken; }
    this.isBreakable = function(){ return breakable; }
}
