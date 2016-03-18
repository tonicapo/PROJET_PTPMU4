function Potion(level, position, animationFrames){
    Loot.call(this, level, position);

    this.setHitBox(13 * platformer.scale, 16 * platformer.scale);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);

    this.animationList.idle = new Animation('idle', animationFrames, 300);

    this.pickLoot = function(entity){
        this.applyPotionEffect(entity);
    }

    this.applyPotionEffect = function(entity){
        if(this.constructor.name == 'HealthPotion'){
            entity.setHealth(entity.property.maxHealth);
            entity.setBleeding(false);
        }
        else if(this.constructor.name == 'SpeedPotion'){
            entity.setBonus('speed', 1.35, 10000);
        }
        else if(this.constructor.name == 'StrengthPotion'){
            entity.setBonus('strength', 1.5, 5000)
        }
        else if(this.constructor.name == 'ResistancePotion'){
            entity.setBonus('resistance', 2, 5000)
        }
    }
}


function HealthPotion(level, position){
    Potion.call(this, level, position, platformer.textures.items.healthPotion);
}

function SpeedPotion(level, position){
    Potion.call(this, level, position, platformer.textures.items.speedPotion);
}

function StrengthPotion(level, position){
    Potion.call(this, level, position, platformer.textures.items.strengthPotion);
}

function ResistancePotion(level, position){
    Potion.call(this, level, position, platformer.textures.items.resistancePotion);
}
