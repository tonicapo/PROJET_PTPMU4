function BackEnd()
{
  var login_form;
    var playerLogged = new CustomEvent("PlayerLogged");
  var gameWrapper;
  
    if(document.cookie.indexOf('email'+'=')!=-1)
    {
          this.init = function(target)
          {
            gameWrapper = target;
          }

          this.login = function()
          {
             window.dispatchEvent(playerLogged);
          };
    }
    else
    {
      this.init = function(target)
      {
        gameWrapper = target;
        createForm('form_log');
      }
  
      this.login = function()
      {
        document.getElementById('form_log').onsubmit=function(e)
        {
          e.preventDefault();
          var email = document.getElementById('pseudo_champs').value;
          var motdepasse = document.getElementById('motdepasse_champs').value;
          var type_form = document.getElementById('champs_cache').value;
        

          ajaxSend(email,motdepasse,type_form, function(answer){
              // reponse
              if(answer.responseText == 'true'){
                  
                window.dispatchEvent(playerLogged);  
                document.getElementById('form_log').style.display = 'none';
              }
              else
              {
                  document.getElementById('form_log').reset();
                  var new_ligne = document.createElement('p');
                  new_ligne.id = "texte_error";
                  new_ligne.innerHTML = "<p>"+answer.responseText+"</p>";
                  document.getElementById('form_log').appendChild(new_ligne);
              }
          });
          

        };
      }
    }
    
    
  
  
  function createForm(id){
    /*** Création du formulaire ***/
      login_form = document.createElement('form');
      gameWrapper.appendChild(login_form);
      login_form.setAttribute('id', id);
      login_form.style.position = 'absolute';
      login_form.style.zIndex = 10;
      
      texte = document.createElement('p');
      login_form.appendChild(texte);
      texte.setAttribute('id', 'titre_form');
      document.getElementById('titre_form').innerHTML = 'Merci de renseigner vos identifiants :';
      
      var tab_type_input = ['pseudo', 'password','password', 'hidden','submit'];
      var tab_name_input = ['pseudo_champs', 'motdepasse_champs', 'motdepasse_confirm', 'champs_cache', 'valider'];
      var tab_class_input = ['input_form_login', 'input_form_login', 'input_form_login', 'input_form_login', 'input_submit'];
      var tab_placeholder_input = ['Votre pseudo', 'Votre mot de passe', 'Confirmation de votre mot de passe', '', ''];
      var tab_value_input = ['', '', '', 'connexion', 'Se connecter'];
      
      for(var i=0; i<tab_type_input.length; i++)
      {
        create_input(login_form,tab_name_input[i], tab_name_input[i], tab_type_input[i], tab_placeholder_input[i], tab_value_input[i], tab_class_input[i]);
      }      
      
      texte_change = document.createElement('a');
      login_form.appendChild(texte_change);
      texte_change.setAttribute('id', 'change_titre');
      texte_change.setAttribute('href', '#');
      texte_change.setAttribute('data-change', 'connexion');
      document.getElementById('change_titre').innerHTML = 'Pas encore inscrit ? Inscrivez vous';
      change_form();
  }
  
    function ajaxSend(email, motdepasse, type_form, callback)
    {
        var reponse;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'connexion.php?pseudo='+email+'&motdepasse='+motdepasse+'&type_form='+type_form);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.send(JSON.stringify({
          pseudo_user: email,
          motdepasse_user: motdepasse
      }));
      
      xhr.addEventListener('readystatechange', function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) { // La constante DONE appartient à l'objet XMLHttpRequest, elle n'est pas globale
            
        if(typeof callback === 'function') callback(xhr);
        }
      });
    }
    
    function create_input(where, id, name, type, placeholder, value, classe)
    {
        input = document.createElement('input');
        where.appendChild(input);
        input.type = type;
        input.name = name;
        input.id = id;
        input.setAttribute('placeholder', placeholder);   
        input.setAttribute('value', value);  
        input.setAttribute('class', classe);
    }
    function keep_session()
    {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'keep_session.php');
        xhr.send(null);
    }
    
    function change_form()
    {
        document.getElementById('change_titre').onclick = function()
        {
            var data_change = this.getAttribute('data-change');
            console.log(data_change);
            
            if(data_change == 'connexion')
            {
                this.innerHTML = 'Déjà inscrit ? Connectez vous !';
                this.setAttribute('data-change', 'register');
                document.getElementById('motdepasse_confirm').style.display = 'block';
                document.getElementById('valider').value = "S'inscrire";
                document.getElementById('champs_cache').value = "register";
            }
            else
            {
                this.innerHTML = 'Pas encore inscrit ? Inscrivez vous !';
                this.setAttribute('data-change', 'connexion');
                document.getElementById('motdepasse_confirm').style.display = 'none';
                document.getElementById('valider').value = "Se connecter";
                document.getElementById('champs_cache').value = "connexion";
            }
        }
    }
  /* 
  **Fonction qui envoie une req de connexion avec une paire (id(email), mot de passe)
  Puis
  Fonction qui vérifie :
  ****si  la connexion est toujours bonne (demander au serveur si 
l'id en cours est != 0 (var de session (fichier avec SetInrterval)))
  ****Si jamais il n'est pas co :
  ****je mets le jeu sur pause (platformer.game.pause / platformer.game.resume)

  **Fonction d'initialisation qui va créer le formulaire

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
