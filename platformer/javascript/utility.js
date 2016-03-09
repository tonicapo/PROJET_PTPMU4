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

/**
* Arrondir un nombre à x décimale après la virgule
* a - chiffre à Arrondir
* b - nombre de décimale après la virgule
*/
platformer.math.roundAt = function(a, b){
    if(typeof b === 'undefined') b = 0;
    var x = Math.pow(10, b);
    return Math.round(a * x) / x;
}

/**
* Interpolation
*/
platformer.math.lerp = function(start, end, percent){
     return (start + percent*(end - start));
}

/**
* Random
*/
platformer.math.randomInt = function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

platformer.math.randomArbitrary = function(min, max){
    return Math.random() * (max - min) + min;
}

platformer.math.randomFloat = function(min, max){
    return Math.round(platformer.math.randomArbitrary(min, max) * 100) / 100;
}

platformer.math.randomChoiceArray = function(choices){
    return choices[platformer.math.randomInt(0, choices.length - 1)];
}

platformer.math.randomChoiceObject = function(obj){
    var keys = Object.keys(obj);
    return obj[keys[platformer.math.randomInt(0, keys.length)]];
}

platformer.math.toFloat = function(a){
    return Math.floor(a * 100) / 100;
}

/**
* Retourne la timestamp courante
*/
platformer.timestamp = function(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}
