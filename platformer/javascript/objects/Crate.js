function Crate(level, point, metadata){
    Tile.call(this, level, platformer.tiletype.crate, point, 1, 0);
    this.setBreakable(true);
    this.metadata = metadata;
    this.replacementTiletype = platformer.tiletype.void;
}

function PotionCrate(level, point){
    Crate.call(this, level, point, 1);

    var self = this;

    this.break = function(){
        this.metadata = 2;
        this.setBroken(true);

        level.getTimers().addTimer(function(){
            self.metadata = 0;
            self.tiletype = self.replacementTiletype;

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

            self.setBreakable(false);
            level.spawnLoot(item);
        }, 150);
    }
}

function CoinCrate(level, point){
    Crate.call(this, level, point, 0);

    var self = this;

    this.break = function(){
        this.metadata = 3;
        this.setBroken(true);

        level.getTimers().addTimer(function(){
            self.metadata = 0;
            self.tiletype = self.replacementTiletype;

            var rand = Math.random();
            if(rand < 0.25){
                var position = getPositionAtCoord(point.x, point.y);
                position.x += self.width / 2;
                position.y += self.height / 2;

                self.setBreakable(false);
                level.spawnLoot(new Saphir(level, position, false, 500));
            }
        }, 150);
    }
}

function WeaponCrate(level, point){
    Crate.call(this, level, point, 4);

    var self = this;
    var list = [
        SwordItem,
        BowItem,
        KnifeItem
    ];

    this.break = function(entity){
        this.metadata = 5;
        this.setBroken(true);

        level.getTimers().addTimer(function(){
            self.metadata = 0;
            self.tiletype = self.replacementTiletype;

            var items = [];
            var equipped = entity.getSelectedItem();

            for(var i = 0; i < list.length; i++){
                if(equipped.constructor.name != list[i].name){
                    items.push(list[i]);
                }
            }

            var item = randomChoiceArray(items);
            var position = getPositionAtCoord(point.x, point.y);

            self.setBreakable(false);
            level.spawnLoot(new item(level, position));
        }, 150);
    }
}
