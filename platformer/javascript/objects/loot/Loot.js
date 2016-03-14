function Loot(level, point){
    Particle.call(this, level, new Position(point.x * platformer.tileSizeX, point.y * platformer.tileSizeY), platformer.tileSizeX, platformer.tileSizeY, -1);

    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.property.fallSpeed = 3;
    this.property.maxFallSpeed = 3;
    this.property.speed = 1;
    this.property.stopSpeed = 0.5;
    this.property.maxSpeed = 2;

    this.setSpread(0);
    this.setVelocity(0, -10);
    this.setFriction(0, 0.2);

    this.init = function(){}

    this.update = function(){
        this.updateBehaviour();
        this.updateParticuleMovement();
        this.updateMovement();
        this.updateStatus();
    }

    this.updateStatus = function(){
        // on boucle dans la liste des tiles visibles pour savoir si on a touché un tile cassable
        if(this.getHitBox().intersects(level.getPlayer())){
            this.setDirty(true);
        }
    }

    this.render = function(ctx, panX, panY){
        var renderBox = this.getRenderBox();
        ctx.drawImage(this.getTexture(), renderBox.x - panX, renderBox.y - panY, renderBox.width, renderBox.height);
    }

    this.renderHitBox = function(ctx, panX, panY){
        var hitBox = this.getHitBox();
        ctx.strokeStyle = '#000';
        ctx.strokeRect(hitBox.x - panX, hitBox.y - panY, hitBox.width, hitBox.height);
    }

    this.renderDimension = function(ctx, panX, panY){
        ctx.strokeStyle = 'red';
        ctx.strokeRect(this.x - panX, this.y - panY, this.width, this.height);
    }
}
