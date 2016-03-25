function BackEnd()
{
  var login_form;
    var playerLogged = new CustomEvent("PlayerLogged");
  var gameWrapper;
  
  this.init = function(target)
  {
    gameWrapper = target;
    createForm();
  }
  
  this.login = function()
  {
    console.log('coucou');
    window.dispatchEvent(playerLogged);
  }
  
  function createForm(id){
    /*** Création du formulaire ***/
      login_form = document.createElement('form');
      gameWrapper.appendChild(login_form);
      login_form.setAttribute('id', id);
      login_form.style.position = 'absolute';
      login_form.style.left = '0px';
      
      input_email = document.createElement('input');
      login_form.appendChild(input_email);
      input_email.type = 'text';
  }
  /* 
  Fonction qui envoie une req de connexion avec une paire (id(email), mot de passe)
  Puis
  Fonction qui vérifie :
      - si  la connexion est toujours bonne (demander au serveur si 
l'id en cours est != 0 (var de session (fichier avec SetInrterval)))
      - Si jamais il n'est pas co :
          - je mets le jeu sur pause (platformer.game.pause / platformer.game.resume)

  Fonction d'initialisation qui va créer le formulaire

  Petites fonctions privées qui vont cacher/afficher le formulaire

  Dès que la page est prête, vérifier si l'user est connecté, 
    - S'il est pas connecté afficher le formulaire (vérifier avec COOKIE)
  
  Fonction qui renvoie true ou false si l'user est connecté (var Session existante ou non)
  
  Fonction pour centrer : 
  
  
  /*
  
  Si le gars n'est pas co, afficher formulaire de connexion
  
  Req ajax Js pour verifier la connexion
  
  
  */
}
