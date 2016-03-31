<?php include('backend.php'); ?>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="author" content="METTER-ROTHAN Jérémie, ULRICH François, KADDOUR Masinissa, EL GHAZI Marwane">
        <!-- VIEWPORT - permet de conserver les dimensions des blocks sur mobile  -->
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <title>Blood &amp; Guts</title>
        <link href="./style.css" rel="stylesheet" type="text/css" />
        <script src="./platformer/javascript/Platformer.js"></script>
        <script src="./javascript/functions.js"></script>
        <script src="./javascript/main.js"></script>
    </head>
    <body>
        <div id="bloodAndGuts"></div>
        <ul id="controls">
            <li><span class="key">&#8592;</span> Gauche</li>
            <li><span class="key">&#8594;</span> Droite</li>
            <li><span class="key">&#8593;</span> Sauter</li>
            <li><span class="key">Espace</span> Sélectionner / Attaquer</li>
            <li><span class="key">Echap</span> Pause</li>
            <li><span class="key">R</span> Rejouer</li>
            <li><span class="key">M</span> Menu</li>
            <li><span class="key">F</span> Plein écran</li>
        </ul>
        <div id="content" class="wrapper clearfix">
            <h1>Blood &amp; Guts</h1>
            <form id="login" class="gameForm" action="backend.php" method="POST" data-type="login">
                <h4>Login</h4>
                <input type="text" name="email" placeholder="Adresse email">
                <input type="password" name="password" placeholder="Mot de passe">
                <input type="submit" value="Se connecter">
                <div class="message error" id="error-login-1">Impossible de se connecter</div>
                <div class="message success" id="success-login-1">Connecté !</div>
            </form>
            <form id="register" class="gameForm" action="backend.php" method="POST" data-type="register">
                <h4>Inscription</h4>
                <input type="text" name="pseudo" placeholder="Pseudonyme">
                <input type="text" name="email" placeholder="Adresse email">
                <input type="password" name="password" placeholder="Mot de passe">
                <input type="submit" value="Inscription">
                <div class="message error" id="error-register-1">Formulaire incomplet</div>
                <div class="message error" id="error-register-2">Adresse email invalide</div>
                <div class="message error" id="error-register-3">Mot de passe invalide</div>
                <div class="message error" id="error-register-4">Pseudonyme invalide</div>
                <div class="message error" id="error-register-5">Le compte existe déjà</div>
                <div class="message success" id="success-register-1">Compte enregistré, veuillez vous connecter.</div>
            </form>
        </div>
    </body>
</html>
