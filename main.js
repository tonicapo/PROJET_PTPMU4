window.addEventListener('DOMContentLoaded', function(){

  var gameID = 'bloodAndGuts';
  
  // le conteneur du jeu
  var gameWrapper = document.createElement('div');
  gameWrapper.setAttribute('id', gameID);
  gameWrapper.style.position = 'relative';
  document.body.appendChild(gameWrapper);
  
  /** Appel de la classe Connexion pour permettre la connexion de l'user, l'envoi des données etc...**/
  var backEnd = new BackEnd();
  backEnd.init(gameWrapper);
  
  window.addEventListener('PlayerLogged', function(){

        platformer.init(gameID, {
            title : 'Blood & Guts',
            debug : true,

            width : 1440,
            height : 700,

            fullscreen : false,

            seed : undefined,

            font : 'silkscreen',

            onready : gameReady,
            onresize : gameResize
        });

        function gameReady(){
            window.addEventListener('playerdeath', function(e){
              
                addValueOnDeath(e.detail.stats);
                
                exec_request('POST', 'wesh.php',{user_id:42}, function(xhr){
                    console.log(xhr);
                });
             // console.log(e.detail.stats);
            });
            
            document.addEventListener('levelcomplete', function(e){
              
                addValueOnDeath(e.detail.stats);
                
                exec_request('POST', 'wesh.php',{user_id:42}, function(xhr){
                    console.log(xhr);
                });
             // console.log(e.detail.stats);
            });
        }
      
        function tab_element_object(objet)
        {
            var nb_elements = Object.keys(objet).length;
            var val_object=['coins','kills'];
            var tab=[];
            
            for(var i=0;i<nb_elements;i++)
            {
                tab.push(objet[val_object[i]]);
            }
            return tab;
        }
      
        function addValueOnDeath(stats)
        {
          var xhr = new XMLHttpRequest();
          var tab_stats = tab_element_object(stats);
          xhr.open('GET', 'onplayerdeath.php?valeur='+tab_stats);
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

          xhr.send(null);

          xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // La constante DONE appartient à l'objet XMLHttpRequest, elle n'est pas globale
                //console.log('mooooort');
                return stats;
                
            }
          });
        }
      
        function exec_request(method, file, values, callback)
        {
          var xhr = new XMLHttpRequest();
          xhr.open(method, file);
            
            // transformer object avec cle/valeur
          xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            
          //xhr.setRequestHeader('Content-Type', 'application/json');

          xhr.send("data="+JSON.stringify(values));

          xhr.addEventListener('readystatechange', function() {
            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // La constante DONE appartient à l'objet XMLHttpRequest, elle n'est pas globale
                if(typeof callback === 'function')
                {
                    callback(xhr);
                }
            }
          });
        }

        function gameResize(width, height){
            // mobile & tablet & support plus petits
            if(window.innerWidth < width || window.innerHeight < height){
                platformer.game.fullscreen();
                console.log(width, height, window.innerWidth);
            }

            // centrage sur l'écran pour le mode fenêtré
            if(!platformer.fullscreen){
                centerRelativeToScreen(gameWrapper);
            }
            else{
                gameWrapper.style.marginTop = 0;
                gameWrapper.style.marginLeft = 0;
            }
        }

        // permet de centrer un élément sur le viewport
        function centerRelativeToScreen(target){
            if(typeof target === 'undefined'){
                return false;
            }
            target.style.marginTop = ((window.innerHeight - parseInt(target.style.height, 10)) / 2) + 'px';
            target.style.marginLeft = ((window.innerWidth - parseInt(target.style.width, 10)) / 2) + 'px';
        }
    });
    backEnd.login();
});
