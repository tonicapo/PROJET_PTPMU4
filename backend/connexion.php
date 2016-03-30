<?php
$session = new Session;
if(isset($_GET['pseudo']) && isset($_GET['motdepasse']) && isset($_GET['type_form']))
{
    $email = htmlentities($_GET['pseudo']);
    $type = htmlentities($_GET['type_form']);
    $password = sha1(Session::PWD_SALT.'/'.$email.'/'.htmlentities($_GET['motdepasse']));
    
    if($session->login($type, $email, $password))
    {
        return true;
    }
}
else
{
    echo "ERRROR AU DEBUT";
    echo $_GET['pseudo'];
    echo $_GET['motdepasse'];
    echo $_GET['type_form'];
    
}

function connectDatabase(){
        // connexion à la base en PDO
        // @return instance pdo
        $host = 'localhost';
        $base = 'ptpmu4_jeu';
        $username = 'root';
        $password = '';

        try{
            $pdo = new PDO("mysql:host=". $host . ";dbname=". $base, $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $pdo;
        }
        catch(Exception $e){
            return $e;
        }
    }


class Session
{
    const PWD_SALT = 'a4W_p'; //Fais que c'est accessible depuis tous les fichiers.

    protected $id;

    public function __construct(){
        $this->setID();
        $this->init();
    }

    public function init(){
        if(isset($_SESSION['user_id'])){
            $this->id = (int)$_SESSION['user_id'];
        }
        else{
            $_SESSION['user_id'] = 0;
        }
        
        if($_SESSION['user_id'] == 0 && isset($_COOKIE['email']) && isset($_COOKIE['password'])){
            $email = htmlentities($_COOKIE['email']);
            $password = htmlentities($_COOKIE['password']);

            $id = $this->login($email, $password);

            if($id !== false){
                $this->setID($id);
            }
        }
    }

    public function getID(){
        return $this->id;
    }

    protected function setID($id = 0){
        $this->id = (int)$id;
    }

    public function login($type, $email, $password){
        if(!empty($email) && !empty($password)){
            $pdo = connectDatabase();
            
            $email_quote = $pdo->quote($email);
            
            $select = $pdo->query("SELECT * FROM game_users WHERE email=$email_quote");
            $info_user = $select->fetch();
            $etat='';
            
            if($type == 'register')
          	{
                $crypt_password = $pdo->quote(sha1(Session::PWD_SALT . '/' . $email . '/' . htmlentities($_GET['motdepasse'])));
                echo $password;
                echo $email_quote;
                $pdo->query("INSERT INTO game_users SET email=$email_quote, password=$crypt_password");
                $etat='true';
                return $etat;
                session_start();
                $_SESSION['user_id'] = $info_user['user_id'];
                $_SESSION['email'] = $email;

                setcookie("email", $_SESSION['email'], time()+3600*24*30*12);  /* expire dans 12 mois */
                setcookie("id", $_SESSION['user_id'], time()+3600*24*30*12);  /* expire dans 12 mois */
          	}
            elseif($type == 'connexion')
            {
                $req = $pdo->query("SELECT * FROM game_users WHERE email = '$email'");
                $info_user = $req->fetch();
                if($password == $info_user['password'])
                {
                    session_start();
                    $_SESSION['user_id'] = $info_user['user_id'];
                    $_SESSION['email'] = $email;

                    setcookie("email", $_SESSION['email'], time()+3600);  /* expire dans 1 heure */
                    setcookie("id", $_SESSION['user_id'], time()+3600);  /* expire dans 1 heure */
                    $etat='true';
                    echo $etat;
                }
                else
                {
                    if($info_user['email'])
                    {
                        echo "Le mot de passe correspondant à ".$info_user['email']." est inexistant.";
                    }
                    else
                    {
                        echo "Cette adresse mail est inconnue, veuillez vous inscrire.";
                    }
                    $etat='false';
                }
                
                // Faire fichier PHP avec si on l'appelle comme argument l'id du membre, nb victime, nb piece, classement, et adresse mail converti en JSON et echo puis die()
                
            }
        }
    }
    
    public function __toString(){
        return $this->id;
    }
}
?>
