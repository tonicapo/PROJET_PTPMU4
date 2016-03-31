<?php
/**
* PLATEFORMER LOGIN
* Gère la connexion au compte
*
*/

$email = '';
$password = '';

if(isset($_POST['email'])){
    $email = htmlentities($_POST['email']);
}

if(isset($_POST['password'])){
    $password = Session::getSecurePassword($email, $_POST['password']);
}


$session->login($email, $password);
$id = (int)$session->getID();

if($id > 0){
    try{
        $result['response']['infos'] = read_data($id);

        $_SESSION['user_id'] = $id;
        $result['status'] = 1;

        array_push($result['notifications'], 'success-login-1');

        $expire = time() + 60 * 60 * 24 * 31;
        // set cookies
        if(!isset($_COOKIE['platformer-email']) || (isset($_COOKIE['platformer-email']) && $_COOKIE['platformer-email'] != $email)){
            $_COOKIE['platformer-email'] = setcookie('platformer-email', $email, $expire);
        }
        if(!isset($_COOKIE['platformer-password']) || (isset($_COOKIE['platformer-password']) && $_COOKIE['platformer-password'] != $password)){
            $_COOKIE['platformer-password'] = setcookie('platformer-password', $password, $expire);
        }
    }
    catch(Exception $e){
        $result['comment'] = $e->getMessage();
    }
}
else{
    array_push($result['notifications'], 'error-login-1');
}
