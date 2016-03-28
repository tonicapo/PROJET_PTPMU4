function FireBall(level, originEntity, targets, position, direction){
    Projectile.call(this, level, originEntity, targets, platformer.weapons.fireBallSpell, position, direction, 56, 40);

    var self = this;
    var focusedEntity;

    var range = 600;

    this.animationList.moving = new Animation('moving', platformer.textures.items.fireBallMoving, 50);
    this.animationList.idle = new Animation('idle', platformer.textures.items.fireBallIdle, 50);

    this.property.speed = 1;
    this.property.stopSpeed = 0.5;
    this.property.maxSpeed = 3;

    this.setMaxDistance(500);
    this.setDestructOnStopped(true);
    this.setFollowingTarget(false);
    this.setDeflectable(true);

    this.y = originEntity.y + this.height / 2


    function getFocus(){
        /**
            La boule de feu va focus l'entité la plus proche en face d'elle parmis la liste des cibles possibles
        */
        var center = self.getCenter();
        var radius = new Rectangle(center.x - range / 2, center.y - range / 2, range, range);

        for(var i = 0, n = targets.length; i < n; i++){
            var t = targets[i];
            if(radius.intersects(t) && t !== originEntity && !t.isDead()){
                if(typeof focusedEntity === 'undefined' ||
                    (typeof focusedEntity !== 'undefined' && direction == 0 && t.x > focusedEntity.x) ||
                    (typeof focusedEntity !== 'undefined' && direction == 1 && t.x < focusedEntity.x)
                ){
                    focusedEntity = t;
                }
            }
        }
    }



    this.update = function(){
        getFocus();

        if(typeof focusedEntity !== 'undefined'){
            if(this.y > focusedEntity.y){
                this.y += -1;
            }
            else if(this.y < focusedEntity.y){
                this.y += 2;
            }


            // on perd le focus dans le cas où la boule de feu rate la cible
            if(this.x < focusedEntity.x && direction == 0){
                focusedEntity = undefined;
            }
            else if(this.x > focusedEntity.x && direction == 1){
                focusedEntity = undefined;
            }
        }


        this.updateProjectile();
    }

    this.animate = function(){
        if(this.isStopped()){
            this.setAnimation(this.animationList.idle);
        }
        else{
            this.setAnimation(this.animationList.moving);
        }
    }
}
