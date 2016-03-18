function Crate(level, point){
    Tile.call(this, level, platformer.tiletype.crate, point, 1, 0);
    
    this.setBreakable(true);

    this.break = function(){
        var rand = Math.random();
        var item;

        if(rand > 0.75){
            item = new HealthPotion(level, getPositionAtCoord(point.x, point.y));
        }
        else if(rand > 0.5){
            item = new SpeedPotion(level, getPositionAtCoord(point.x, point.y));
        }
        else if(rand > 0.25){
            item = new ResistancePotion(level, getPositionAtCoord(point.x, point.y));
        }
        else{
            item = new StrengthPotion(level, getPositionAtCoord(point.x, point.y));
        }

        level.spawnLoot(item);
        this.setBreakable(false);
        this.tiletype = platformer.tiletype.void;
    }
}
