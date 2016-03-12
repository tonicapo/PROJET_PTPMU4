function Weapon(name, texture, options){
    this.property = new Object;

    this.property.damage = (typeof options.damage !== 'undefined') ? options.damage : 0;
    this.property.maxDamage = (typeof options.maxDamage !== 'undefined') ? options.maxDamage : 0;
    // effet de recul
    this.property.knockback = (typeof options.knockback !== 'undefined') ? options.knockback : 0;
    this.property.maxKnockback = (typeof options.maxKnockback !== 'undefined') ? options.maxKnockback : 0;
    // portée
    this.property.range = (typeof options.range !== 'undefined') ? options.range : 0;
    this.property.maxRange = (typeof options.maxRange !== 'undefined') ? options.maxRange : 0;
    // delais pour effectuer une attaque
    this.property.delay = (typeof options.delay !== 'undefined') ? options.delay : 0;
    // permet d'affecter un coefficient pour réduire / augmenter la quantité de sang projetée après un coup
    this.property.bleeding = (typeof options.bleeding !== 'undefined') ? options.bleeding : 1;
    // ajoute un projectile
    this.property.projectile = (typeof options.projectile !== 'undefined') ? options.projectile : false;


    this.getName = function(){ return name; }
    this.getTexture = function(){ return texture; }
}
