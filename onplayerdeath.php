<meta charset="utf-8">
<?php
session_start();
$session = new OnDeath;
if(isset($_COOKIE['email']) && isset($_GET['valeur']))
{
    $email = htmlentities($_COOKIE['email']);
    $valeur = htmlentities($_GET['valeur']);
    $session->insert($valeur);
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


class OnDeath
{
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

    public function insert($value){
        if(isset($_SESSION) && !empty($value)){
            $pdo = connectDatabase();
            
            $email_user = $_SESSION['email'];
            $id_user = $_SESSION['user_id'];
            
            $tab_value = explode(",", $value);
            $nb_pieces = $tab_value[0];
            $nb_victimes = $tab_value[1];
            
            $select = $pdo->query("SELECT * FROM game_scores WHERE user_id=$id_user");
            $req = $select->fetch();
            
            if($select->rowCount() == 0)
          	{
                $pdo->query("INSERT INTO game_scores SET user_id='$id_user', nb_victimes='$nb_victimes', nb_pieces='$nb_pieces', date_ajout=NOW()");
          	}
            else
            {
                $pdo->query("UPDATE game_scores SET nb_victimes='$nb_victimes', nb_pieces='$nb_pieces', date_ajout=NOW() WHERE user_id='$id_user'");
            }
            
            /*$email_quote = $pdo->quote($email);
            
            $nb_victimes = $pdo->quote($_POST['nb_victimes']);
            $nb_pieces = $pdo->quote($_POST['nb_pieces']);
            
            $select = $pdo->query("SELECT * FROM game_users WHERE email=$email_quote");
            $info_user = $select->fetch();
            
            $id_user = $info_user['user_id'];
            $select = $pdo->query("SELECT * FROM game_scores WHERE user_id=$id_user");
            
          	 */
            
        }
        else
        {
            echo "Cookie non défini.";
        }
    }
    
    public function __toString(){
        return $this->id;
    }
}
?>
