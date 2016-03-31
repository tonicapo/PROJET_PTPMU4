<?php
class Session
{
    const PWD_SALT = 'a4W_p';

    protected $id;

    public function __construct(){
        $this->setID();
        $this->init();
    }

    private function init(){
        if(isset($_SESSION['user_id'])){
            $this->id = (int)$_SESSION['user_id'];
        }
        else{
            $_SESSION['user_id'] = 0;
        }
        /*
        if($_SESSION['user_id'] == 0 && isset($_COOKIE['email']) && isset($_COOKIE['password'])){
            $email = htmlentities($_COOKIE['email']);
            $password = htmlentities($_COOKIE['password']);

            $id = $this->login($email, $password);

            if($id !== false){
                $this->setID($id);
            }
        }
        */
    }

    public function getID(){
        return $this->id;
    }

    protected function setID($id = 0){
        $this->id = (int)$id;
    }

    public function login($email, $password){
        // connexion à la base
        $pdo = connectDatabase();

        if(!empty($email) && !empty($password)){
            $values = [':email' => $email, ':password' => $password];

            $req = $pdo->prepare("SELECT user_id FROM ".SQL_PREFIX."users WHERE email = :email AND password = :password");

            if($req->execute($values)){
                $id = $req->fetchColumn();
                if($id !== false){
                    $this->setID($id);
                }
                else{
                    $this->setID(0);
                }
            }

            $req->closeCursor();
        }
    }

    public function register($pseudo, $email, $password){
        $pdo = connectDatabase();

        $values = [':pseudo' => $pseudo,  ':email' => $email, ':password' => self::getSecurePassword($email, $password)];
        $req = $pdo->prepare("INSERT INTO ".SQL_PREFIX."users(email, pseudo, password) VALUES(:email, :pseudo, :password); INSERT INTO ".SQL_PREFIX."scores (user_id) VALUES (LAST_INSERT_ID())");
        $tmp = $req->execute($values);
        $req->closeCursor();
        return $tmp;
    }

    // retourne un mot de passe sécurisé
    public static function getSecurePassword($email, $password){
        return sha1(self::PWD_SALT . '/' . $email . '/' . htmlentities($password));
    }

    public function disconnect(){
        unset($_SESSION['user_id']);
        setcookie('email', '', -1);
        setcookie('password', '', -1);
    }

    public function __toString(){
        return $this->id;
    }
}
