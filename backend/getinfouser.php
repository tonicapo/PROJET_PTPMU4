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

    $tab_post = json_decode($_POST['data'], true);
    $id_user = $tab_post['user_id'];

    $select = $pdo->query("SELECT * FROM game_users INNER JOIN game_scores ON game_users.user_id = game_scores.user_id WHERE game_users.user_id=$id_user");
    $info_user = $select->fetch();
    
    $tab_user = ["email"=> $info_user['email'], "nb_victimes"=> $info_user['nb_victimes'], "nb_pieces"=> $info_user['nb_pieces']];
// var classement
    print_r($tab_user);
?>