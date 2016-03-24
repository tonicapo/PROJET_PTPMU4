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
* Evenements uniques
* Source : http://www.sitepoint.com/create-one-time-events-javascript/
*/
function onetime(node, type, callback){
    // create event
	node.addEventListener(type, function(e) {
		// remove event
		e.target.removeEventListener(e.type, arguments.callee);
		// call handler
		return callback(e);
	});
}
