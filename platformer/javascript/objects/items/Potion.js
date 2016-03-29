function Potion(level, name, position, delay, animationFrames){
    Loot.call(this, level, position, delay);

    this.setHitBox(13 * platformer.scale, 16 * platformer.scale);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.property.fallSpeed = 3;
    this.property.maxFallSpeed = 3;
    this.property.speed = 1;
    this.property.stopSpeed = 0.5;
    this.property.maxSpeed = 2;

    this.setSpread(0);
    this.setVelocity(0, -10);
    this.setFriction(0, 0.2);

    this.animationList.idle = new Animation('idle', animationFrames, 300);

    this.pickLoot = function(entity){
        if(this.applyPotionEffect(entity)){
            this.setDirty(true);
        }
    }

    this.applyPotionEffect = function(entity){
        if(this.constructor.name == 'HealthPotion'){
            if(entity.getHealth() < entity.property.maxHealth){
                entity.setHealth(entity.property.maxHealth);
                entity.setBleeding(false);

                return true;
            }
        }
        else if(this.constructor.name == 'SpeedPotion'){
            if(entity.getBonus('speed') == 1){
                entity.setBonus('speed', 1.2, 10000);
                return true;
            }
        }
        else if(this.constructor.name == 'StrengthPotion'){
            if(entity.getBonus('strength') == 1){
                entity.setBonus('strength', 1.5, 7500);
                return true;
            }
        }
        else if(this.constructor.name == 'ResistancePotion'){
            if(entity.getBonus('resistance') == 1){
                entity.setBonus('resistance', 1.5, 7500);
                return true;
            }
        }

        return false;
    }

    this.getName = function(){ return name; }
}


function HealthPotion(level, position){
    Potion.call(this, level, 'Santé', position, 100, platformer.textures.items.healthPotion);
}

function SpeedPotion(level, position){
    Potion.call(this, level, 'Vitesse', position, 100, platformer.textures.items.speedPotion);
}

function StrengthPotion(level, position){
    Potion.call(this, level, 'Force', position, 100, platformer.textures.items.strengthPotion);
}

function ResistancePotion(level, position){
    Potion.call(this, level, 'Résistance', position, 100, platformer.textures.items.resistancePotion);
}
