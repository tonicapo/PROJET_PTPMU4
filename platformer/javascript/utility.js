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
function roundAt(a, b){
    if(typeof b === 'undefined') b = 0;
    var x = Math.pow(10, b);
    return Math.round(a * x) / x;
}

/**
* Interpolation
*/
function lerp(start, end, percent){
     return (start + percent*(end - start));
}

/**
* Random
*/
function randomInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function randomArbitrary(min, max){
    return Math.random() * (max - min) + min;
}

function randomFloat(min, max){
    return Math.round(randomArbitrary(min, max) * 100) / 100;
}

function randomChoiceArray(choices){
    return choices[randomInt(0, choices.length)];
}

function randomChoiceObject(obj){
    var keys = Object.keys(obj);
    return obj[keys[randomInt(0, keys.length)]];
}

function toFloat(a){
    return Math.floor(a * 100) / 100;
}

/**
* Retourne la timestamp courante
*/
function timestamp(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}


// retourne une position aux points x et y donnés
function getPositionAtCoord(x, y){
    return new Position(x * platformer.tileSizeX, y * platformer.tileSizeY);
}



/**
* Permet d'afficher des messages dans la console seulement en mode débug
*/
platformer.notify = function(message){
    if(platformer.debug){
        console.info(message);
    }
}

// récupère la liste des touches du clavier sauvegardée ou par défaut si elle n'existe pas encore
platformer.getKeyList = function(){
    var savedKeys = platformer.getRegisteredKeyList();
    var defaultKeys = platformer.defaultKeyList;

    var keyList = { };

    if(typeof savedKeys === 'object' && savedKeys !== null){
        for(var i in defaultKeys){
            keyList[i] = (typeof savedKeys[i] !== 'undefined') ? parseInt(savedKeys[i], 10) : defaultKeys[i];
        }
    }

    return keyList;
}

// permet d'enregistrer la liste courante des touches
platformer.registerKeyList = function(){
    localStorage.setItem('platformer_keylist', JSON.stringify(platformer.keylist));
}

// permet de récupérer les touches enregistrées dans le local storage
platformer.getRegisteredKeyList = function(){
    return JSON.parse(localStorage.getItem('platformer_keylist'));
}
