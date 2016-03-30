<?php 
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

    $pdo = connectDatabase();
    session_start();
    $tab_post = json_decode($_POST['data'], true);

    $id_user = $_SESSION['user_id'];
    $nb_pieces = $tab_post['coins'];
    $nb_victimes = $tab_post['kills'];

    $select = $pdo->query("SELECT * FROM game_scores WHERE user_id=$id_user");
    $req = $select->fetch();

    if($select->rowCount() == 0)
    {
        $pdo->query("INSERT INTO game_scores SET user_id='$id_user', nb_victimes = $nb_victimes, nb_pieces = $nb_pieces, date_ajout=NOW()");
    }
    else
    {
        $pdo->query("UPDATE game_scores SET nb_victimes = $nb_victimes, nb_pieces = $nb_pieces, date_ajout=NOW() WHERE user_id='$id_user'");
    }

    $select = $pdo->query("SELECT * FROM game_users INNER JOIN game_scores ON game_users.user_id = game_scores.user_id WHERE game_users.user_id=$id_user");
    $info_user = $select->fetch();
    
    $tab_user = ["email"=> $info_user['email'], "nb_victimes"=> $info_user['nb_victimes'], "nb_pieces"=> $info_user['nb_pieces'], "nb_morts"=> $info_user['nb_morts']];
// var classement
    print_r($tab_user);
?>