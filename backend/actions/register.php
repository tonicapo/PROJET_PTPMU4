<?php
/**
* PLATEFORMER REGISTER
* Gère l'inscription de nouveaux joueurs
*
*/

$pseudo = '';
$email = '';
$password = '';


if(isset($_POST['pseudo'], $_POST['email'], $_POST['password'])){
    $pseudo = htmlentities($_POST['pseudo']);
    $email = htmlentities($_POST['email']);
    $password = htmlentities($_POST['password']);

    if(empty($pseudo) || empty($email) || empty($password)){
        array_push($result['notifications'], 'error-register-1');
    }
    else{
        if(!isValidMail($email)){
            array_push($result['notifications'], 'error-register-2');
        }
        if(!isValidPassword($password)){
            array_push($result['notifications'], 'error-register-3');
        }
        if(!isValidUsername($pseudo)){
            array_push($result['notifications'], 'error-register-4');
        }
    }

    if(count($result['notifications']) == 0){
        $register = false;

        try{
            $register = $session->register($pseudo, $email, $password);
        }
        catch(Exception $e){
            $result['comment'] = $e->getMessage();
        }
        finally{
            if($register){
                $result['status'] = 1;
                array_push($result['notifications'], 'success-register-1');
            }
            else{
                array_push($result['notifications'], 'error-register-5');
            }
        }
    }
}
