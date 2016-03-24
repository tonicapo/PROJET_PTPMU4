function Crate(level, point){
    Tile.call(this, level, platformer.tiletype.crate, point, 1, 0);
    this.setBreakable(true);
}

function PotionCrate(level, point){
    Crate.call(this, level, point);

    this.break = function(){
        var rand = Math.random();
        var playerHealth = level.getPlayer().getHealth();
        var playerMaxHealth = level.getPlayer().property.maxHealth;
        var item;
        
        if(playerHealth < playerMaxHealth && rand > 0.6){
            item = new HealthPotion(level, getPositionAtCoord(point.x, point.y));
        }
        else if(playerHealth >= playerMaxHealth && rand > 0.6){
            item = new ResistancePotion(level, getPositionAtCoord(point.x, point.y));
        }
        else if(rand > 0.30){
            item = new StrengthPotion(level, getPositionAtCoord(point.x, point.y));
        }
        else{
            item = new SpeedPotion(level, getPositionAtCoord(point.x, point.y));
        }

        level.spawnLoot(item);
        this.tiletype = platformer.tiletype.void;
    }
}

function CoinCrate(level, point){
    Crate.call(this, level, point);

    this.break = function(){
        var position = getPositionAtCoord(point.x, point.y);
        position.x += this.width / 2;
        position.y += this.height / 2;

        level.spawnLoot(new Ruby(level, position, false, 500));
        this.tiletype = platformer.tiletype.void;
    }
}
