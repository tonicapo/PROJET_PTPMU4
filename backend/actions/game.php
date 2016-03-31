<?php
/**
* PLATEFORMER GAME
* Gère les données de jeu
*
*/
if(isset($_GET['task'])){
    $pdo = connectDatabase();
    $task = htmlentities($_GET['task']);
    $id = (int)$_SESSION['user_id'];

    if($id > 0){
        try{
            if($task == 'add_death'){
                $req = $pdo->prepare("UPDATE ".SQL_PREFIX."scores SET nb_morts = (nb_morts + 1) WHERE user_id = :user_id");
                if($req->execute([':user_id' => $id])){
                    $result['status'] = 1;
                }
            }
            else if($task == 'update' && isset($_POST['coins'], $_POST['kills'])){
                $pieces = (int)$_POST['coins'];
                $victimes = (int)$_POST['kills'];

                $req = $pdo->prepare("UPDATE ".SQL_PREFIX."scores SET nb_pieces = (nb_pieces + :pieces), nb_victimes = (nb_victimes + :victimes) WHERE user_id = :user_id");
                if($req->execute([':user_id' => $id, ':victimes' => $victimes, ':pieces' => $pieces ])){
                    $result['status'] = 1;
                }
            }

            // on récupère les nouvelles valeurs
            $result['response'] = read_data($id);
        }
        catch(Exception $e){
            $result['comment'] = $e->getMessage();
        }
    }
    else{
        $result['comment'] = 'Not connected';
    }
}
