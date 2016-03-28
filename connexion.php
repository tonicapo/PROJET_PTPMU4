<meta charset="utf-8">
<?php
$session = new Session;
if(isset($_GET['pseudo']) && isset($_GET['motdepasse']) && isset($_GET['type_form']))
{
    $email = htmlentities($_GET['pseudo']);
    $type = htmlentities($_GET['type_form']);
    $password = sha1(Session::PWD_SALT.'/'.$email.'/'.htmlentities($_GET['motdepasse']));
    echo $email.' et mot de passe : '.$password;
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
            
            if($type == 'register')
          	{
                $crypt_password = $pdo->quote(sha1(Session::PWD_SALT . '/' . $email . '/' . htmlentities($_GET['motdepasse'])));
                echo $password;
                echo $email_quote;
                $pdo->query("INSERT INTO game_users SET email=$email_quote, password=$crypt_password");
                return true;
          	}
            elseif($type == 'connexion')
            {
                $req = $pdo->query("SELECT * FROM game_users WHERE email = '$email'");
                $info_user = $req->fetch();
                if($password == $info_user['password'])
                {
                    echo "Connexion effectuée";
                    return true;
                }
                
                
            }
            
            session_start();
            $_SESSION['user_id'] = $info_user['user_id'];
            $_SESSION['email'] = $email;
            
            setcookie("email", $_SESSION['email'], time()+3600);  /* expire dans 1 heure */
            setcookie("id", $_SESSION['user_id'], time()+3600);  /* expire dans 1 heure */
        }
    }
    
    public function __toString(){
        return $this->id;
    }
}
?>
