'use strict';

var platformer = platformer || {};

/**
* Récupère une liste d'images et de sons
*/
platformer.loadAssets = function(files, callback){
    if(!Array.isArray(files)){
        files = [files];
    }

    var list = {};
    var index = files.length;

    for(var i = 0, n = files.length; i < n; i++){
        var file = files[i];

        if(file != undefined && file.type != undefined){
            var method = undefined;

            if(file.type == 'image'){
                method = platformer.loadSpritesheet;
            }
            else if(file.type == 'sound'){
                method = platformer.loadSound;
            }
            else if(file.type == 'script'){
                method = platformer.loadScript;
            }

            if(method != undefined){
                method(file.name, file.path, file.options, function(name, item){
                    handler(name, item);
                });
            }
        }
    }

    function handler(name, item){
        if(name != undefined) list[name] = item;
        index--;

        if(index == 0){
            if(typeof callback === 'function'){
                callback(list);
            }
        }
    }
}

/*
* Permet de récupérer une image sur une spritesheet
*/
platformer.getSubImage = function(spritesheet, x, y, width, height){
    if(typeof spritesheet === 'undefined'){
        throw 'Could not read from spritesheet';
        return;
    }

    var canvas, ctx, data, img;

    canvas = platformer.createCanvas(width, height);
    ctx = canvas.getContext('2d');

    data = spritesheet.getImageData(x, y, width, height);
    ctx.putImageData(data, 0, 0);

    img = new Image;
    img.src = canvas.toDataURL('image/png', 1);

    return img;
}

/**
* Charge une image et retourne le contexte de la canvas où on a dessiné l'image
*/
platformer.loadSpritesheet = function(name, filepath, options, callback){
    var canvas, context, img;
    var width = options.width || 0;
    var height = options.height || 0;

    canvas = platformer.createCanvas(width, height);
    context = canvas.getContext('2d');

    img = new Image;
    img.onload = function(){
        context.drawImage(img, 0, 0, width, height);

        if(typeof callback === 'function'){
            callback(name, context);
        }
    }
    img.src = filepath;
}

/**
* Charge un fichier de son
*/
platformer.loadSound = function(name, filepath, options, callback){

}

/**
* Sert à inclure un ou plusieurs fichiers avec un callback une fois terminé
*/
/**
* Sert à inclure un fichier dans le document
* filepath - Le chemin vers le fichier
* callback - Fonction exécutée une fois le fichier chargé
*/
platformer.loadScript = function(name, filepath, options, callback){
    var required = options.required || false;
    var asynchronous = options.asynchronous || false;

    var xhttp = new XMLHttpRequest();
    xhttp.open('GET', filepath, asynchronous);
    xhttp.setRequestHeader('Content-type', 'application/javascript');

    xhttp.onreadystatechange = function(){
        if(xhttp.readyState == 4 && xhttp.status == 200){
            // ajout au document
            var script = document.createElement('script');
            script.innerHTML = xhttp.responseText;

            document.body.appendChild(script);

            if(typeof callback === 'function'){
                callback();
            }
        }
        else if(xhttp.status == 404){
            if(required){
                throw new Error('Impossible de trouver le fichier ' + filepath);
            }
        }
    }

    xhttp.send();
}



/*
* Permet de créer une canvas
*/
platformer.createCanvas = function(width, height){
    var canvas = document.createElement('canvas');

    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);

    return canvas;
}
