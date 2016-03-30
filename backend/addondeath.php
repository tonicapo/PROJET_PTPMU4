<?php 
$pdo = connectDatabase();
session_start();

if (! function_exists('array_column')) {
    function array_column(array $input, $columnKey, $indexKey = null) {
        $array = array();
        foreach ($input as $value) {
            if ( ! isset($value[$columnKey])) {
                trigger_error("Key \"$columnKey\" does not exist in array");
                return false;
            }
            if (is_null($indexKey)) {
                $array[] = $value[$columnKey];
            }
            else {
                if ( ! isset($value[$indexKey])) {
                    trigger_error("Key \"$indexKey\" does not exist in array");
                    return false;
                }
                if ( ! is_scalar($value[$indexKey])) {
                    trigger_error("Key \"$indexKey\" does not contain scalar value");
                    return false;
                }
                $array[$value[$indexKey]] = $value[$columnKey];
            }
        }
        return $array;
    }
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

function classement($connexion){
        if($connexion)
        {
           $select = $connexion->query("SELECT game_users.user_id, email, id_score, nb_pieces, nb_victimes, nb_morts, (nb_victimes+nb_pieces)*(1/nb_morts) as classement FROM game_users INNER JOIN game_scores ON game_users.user_id = game_scores.user_id ORDER BY classement DESC");
            
            $liste_user = $select->fetchAll();
            $id_user = $_SESSION['user_id'];
            
            for ($i=0; $i<count($liste_user);$i++)
            {
                if($liste_user[$i]['user_id'] == $id_user)
                {
                    //echo array_search($id_user[$i]['user_id'], $liste_user);
                    $classement_tab = array_search($id_user, array_column($liste_user, 'user_id'))+1;
                    echo $classement_tab;
                }
            }
            
        }
}

    
    $tab_post = json_decode($_POST['data'], true);

    $id_user = $_SESSION['user_id'];
    $nb_pieces = $tab_post['coins'];
    $nb_victimes = $tab_post['kills'];

    $select = $pdo->query("SELECT * FROM game_scores WHERE user_id=$id_user");
    $req = $select->fetch();

    if($select->rowCount() == 0)
        {
            $pdo->query("INSERT INTO game_scores SET user_id='$id_user', nb_morts = nb_morts+1, date_ajout=NOW()");
        }
        else
        {
            $pdo->query("UPDATE game_scores SET nb_morts = nb_morts+1, date_ajout=NOW() WHERE user_id='$id_user'");
        }

    $select = $pdo->query("SELECT * FROM game_users INNER JOIN game_scores ON game_users.user_id = game_scores.user_id WHERE game_users.user_id=$id_user");
    $info_user = $select->fetch();
    
    $tab_user = ["email"=> $info_user['email'], "nb_victimes"=> $info_user['nb_victimes'], "nb_pieces"=> $info_user['nb_pieces'], "nb_morts"=> $info_user['nb_morts']];
// var classement
    //print_r($tab_user);
    classement($pdo);
?>