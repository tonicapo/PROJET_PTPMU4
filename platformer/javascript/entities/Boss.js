function Boss(level, position){
    AI_Entity.call(this, level, position, 48 * platformer.scale, 81 * platformer.scale);

    var self = this;
    var player = level.getPlayer();

    this.setRenderBox(122 * platformer.scale, 122 * platformer.scale);
    this.setViewBoxHeightRatio(1);
    this.setRangeBoxHeightRatio(1);

    this.property.speed = 0.1;
    this.property.stopSpeed = 0.1;
    this.property.maxSpeed = 0.3;
    this.property.fallSpeed = 0.5;
    this.property.maxFallSpeed = 8;
    this.property.jumpHeight = 2;
    this.property.doubleJumpHeight = 4;
    this.property.maxHealth = 60;
    this.property.baseRange = 50;
    this.property.bleedingChance = 0;
    this.property.attackCooldown = 0;
    this.property.reactionTime = 250;
    this.property.viewDistance = 750;


    this.animationList.idle = new Animation('idle', platformer.textures.boss.idle, 1000, { random : true });
    this.animationList.walking = new Animation('walking', platformer.textures.boss.walking, 400);
    this.animationList.laughing = new Animation('laughing', platformer.textures.boss.laughing, 350);
    this.animationList.falling = new Animation('falling', platformer.textures.boss.falling, 1000);

    this.animationList.fireBallAttack = new Animation('fireBallAttack', platformer.textures.boss.fireBallAttack, 250, { cancelable : true });
    this.animationList.bossFeet = new Animation('bossFeet', platformer.textures.boss.bossFeet, 200, { cancelable : false });

    this.animationList.deadIdle = new Animation('deadIdle', platformer.textures.boss.deadIdle, 100, { loop : false, cancelable : false });
    this.animationList.deadFalling = new Animation('deadFalling', platformer.textures.boss.deadFalling, 0, { loop : false, cancelable : true });

    this.setColor('#D9828C');
    this.setCanDropLoot(true);

    this.setDeathParticle(Bone);
    this.setBloodRatio(0.025);

    this.setIdle(false);
    this.setHostile(true);
    this.setKnockbackImmune(true);

    this.addInventory(new FireBallSpellItem(level));
    this.addInventory(new BossFeetItem(level));

    this.setLoot(Ruby);



    var laughing = false;

    level.getTimers().addTimer(giggle, randomInt(0, 500));

    this.update = function(){
        var entityPos = this.getCenter();
        var playerPos = player.getCenter();

        if(Math.abs(playerPos.x - entityPos.x) < 160){
            this.setSelectedItem(1);
        }
        else{
            this.setSelectedItem(0);
        }

        this.updateMovement();
        this.updateInteraction();
        this.updateObject();

        if(!self.isDead()){
            this.updateLogic();
        }
    }

    function giggle(){
        if(!self.isDead()){
            var delay = (!laughing) ? 2000 : 4500;

            level.getTimers().addTimer(function(){
                var rand = Math.random();
                if(!laughing){
                    laughing = true;
                    self.disableMovement(true);
                    self.setCanUseWeapon(false);
                }
                else{
                    self.disableMovement(false);
                    self.setCanUseWeapon(true);
                    laughing = false;
                }

                giggle();
            }, delay);
        }
    }

    this.isLaughing = function(){
        return laughing;
    }

    this.setLaughing = function(b){
        laughing = b;
    }
}
