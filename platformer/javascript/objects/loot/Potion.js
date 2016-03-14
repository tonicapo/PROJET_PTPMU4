function Potion(level, point){
    Loot.call(this, level, point);

    this.setHitBox(13 * platformer.scale, 16 * platformer.scale);
    this.setRenderBox(platformer.tileSizeX, platformer.tileSizeY);
}


function HealthPotion(level, point){
    Potion.call(this, level, point);
    this.setTexture(platformer.textures.items.potions[1]);
}

function SpeedPotion(level, point){
    Potion.call(this, level, point);
    this.setTexture(platformer.textures.items.potions[2]);
}

function StrengthPotion(level, point){
    Potion.call(this, level, point);
    this.setTexture(platformer.textures.items.potions[0]);
}

function ResistancePotion(level, point){
    Potion.call(this, level, point);
    this.setTexture(platformer.textures.items.potions[3]);
}
