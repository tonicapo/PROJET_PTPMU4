<?php
function connectDatabase(){
    global $db;
    // connexion à la base en PDO
    // @return instance pdo
    try{
        $pdo = new PDO("mysql:host=". $db[0] . ";dbname=". $db[1], $db[2], $db[3], array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $pdo;
    }
    catch(Exception $e){
        return $e;
    }
}



// récupère les informations sur un joueur
function read_data($user_id){
    $pdo = connectDatabase();

    $req = $pdo->prepare("SELECT ".SQL_PREFIX."users.user_id, pseudo, nb_victimes, nb_pieces, nb_morts, lastupdate, (SELECT pseudo FROM ".SQL_PREFIX."users WHERE nb_pieces = (SELECT MAX(nb_pieces) FROM ".SQL_PREFIX."users LIMIT 0, 1) LIMIT 0, 1) AS highscore, (SELECT COUNT(*) FROM ".SQL_PREFIX."users LIMIT 0, 1) AS totalPlayers FROM ".SQL_PREFIX."users INNER JOIN ".SQL_PREFIX."scores ON ".SQL_PREFIX."users.user_id = ".SQL_PREFIX."scores.user_id WHERE ".SQL_PREFIX."users.user_id = :user_id");

    $req->setFetchMode(PDO::FETCH_ASSOC);
    if($req->execute([':user_id' => $user_id])){
        return $req->fetch();
    }

    return false;
}





function isValidMail($email){
    // returns true if mail adress in parameter is valid
    if(preg_match('#[\w\.]+@[\w]+\.[a-z]{2,4}#', $email, $match) == 1){
        return true;
    }
    return false;
}

function isValidUsername($username){
    // return true if username is valid
    if(preg_match('#^[\w]{4,16}$#i', $username, $match) == 1){
        return true;
    }
    return false;
}

function isValidPassword($password){
    // return true if password is valid
    if(preg_match('#^[\w-\+_%$\*\&\#@\!\?]{6,}$#i', $password, $match) == 1){
        return true;
    }
    return false;
}

// autoloader
function load_class($class){
   require './backend/class/' . $class.'.class.php';
}
