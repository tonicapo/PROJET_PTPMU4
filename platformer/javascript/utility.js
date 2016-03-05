var platformer = platformer || {};

/**
* Sert à trouver si une valeur existe dans un tableau
* needle - La valeur que l'on recherche
* Renvoi l'index de la valeur trouvée ou -1
*/
Array.inArray = function(needle){
    for(var i in this){
        if(needle == this[i]){
            return i;
        }
    }
    return -1;
}

platformer.Math = function(){
    /**
    * Arrondir un nombre à x décimale après la virgule
    * a - chiffre à Arrondir
    * b - nombre de décimale après la virgule
    */
    this.roundAt = function(a, b){
        if(typeof b === 'undefined') b = 0;
        var x = Math.pow(10, b);
        return Math.round(a * x) / x;
    }

    /**
    * Interpolation
    */
    this.lerp = function(start, end, percent){
         return (start + percent*(end - start));
    }

    /**
    * Random
    */
    this.randomInt = function(min, max){
        return Math.floor(Math.random() * (max - min)) + min;
    }

    this.randomArbitrary = function(min, max){
        return Math.random() * (max - min) + min;
    }

    this.randomFloat = function(min, max){
        return Math.round(this.randomArbitrary(min, max) * 100) / 100;
    }

    this.randomChoiceArray = function(choices){
        return choices[getRandomInt(0, choices.length - 1)];
    }

    this.randomChoiceObject = function(obj){
        var keys = Object.keys(obj);
        return obj[keys[getRandomInt(0, keys.length)]];
    }
}
