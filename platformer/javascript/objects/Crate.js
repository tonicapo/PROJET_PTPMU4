function Crate(level, position){
    Tile.call(this, level, platformer.tiletype.crate, position, 1, 0);

    this.setBreakable(true);

    this.break = function(){
        var rand = Math.random();
        var item;

        if(rand > 0.75){
            item = new HealthPotion(level, position);
        }
        else if(rand > 0.5){
            item = new SpeedPotion(level, position);
        }
        else if(rand > 0.25){
            item = new ResistancePotion(level, position);
        }
        else{
            item = new StrengthPotion(level, position);
        }

        level.spawnItem(item);
        this.setBreakable(false);
        this.tiletype = platformer.tiletype.void;
    }
}
