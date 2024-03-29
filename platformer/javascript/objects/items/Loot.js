function Loot(level, position, delay){
    Particle.call(this, level, position, platformer.tileSizeX, platformer.tileSizeY, -1, true);

    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    var pickable = false;
    var dropAmount = 1;

    if(typeof delay === 'undefined'){
        delay = -1;
    }

    if(delay != -1){
        level.getTimers().addTimer(function(){
            pickable = true;
        }, delay);
    }


    this.update = function(){
        this.updateBehaviour();
        this.updateParticuleMovement();
        this.updateMovement();
        this.updateStatus();
        this.updateObject();
    }

    this.animate = function(){
        this.setAnimation(this.animationList.idle);
    }

    this.updateStatus = function(){
        // on boucle dans la liste des tiles visibles pour savoir si on a touché un tile cassable
        if(!level.getPlayer().isDead() && this.getHitBox().intersects(level.getPlayer())){
            this.pickLoot(level.getPlayer());
        }
    }

    this.pickLoot = function(entity){
        // action à effectuer une fois le loot ramassé
    }

    this.render = function(ctx, panX, panY){
        var renderBox = this.getRenderBox();
        ctx.drawImage(this.getTexture(), Math.floor(renderBox.x - panX), Math.floor(renderBox.y - panY), renderBox.width, renderBox.height);

        if(platformer.debug){
            this.renderHitBox(ctx, panX, panY);
        }
    }

    this.renderHitBox = function(ctx, panX, panY){
        var hitBox = this.getHitBox();
        ctx.strokeStyle = '#000';
        ctx.strokeRect(Math.floor(hitBox.x - panX), Math.floor(hitBox.y - panY), hitBox.width, hitBox.height);
    }

    this.renderDimension = function(ctx, panX, panY){
        ctx.strokeStyle = 'red';
        ctx.strokeRect(Math.floor(this.x - panX), Math.floor(this.y - panY), this.width, this.height);
    }

    this.isPickable = function(){
        return pickable;
    }

    this.setDropAmount = function(da){
        dropAmount = da;
    }

    this.getDropAmount = function(){ return dropAmount; }
}
