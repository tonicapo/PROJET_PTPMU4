<?php
#display errors
error_reporting(E_ALL | E_STRICT);
ini_set('display_startup_errors', 1);
ini_set('display_errors', 1);

session_start();

// fonctions utiles et PDO
#$GLOBALS['db'] = ['localhost', 'ptpmu4_jeu', 'root', 'root'];
$GLOBALS['db'] = ['metterfrvwadmin.mysql.db', 'metterfrvwadmin', 'metterfrvwadmin', 'W47krmf9'];
require('./backend/functions.php');

// chargement automatique des classes
spl_autoload_register('load_class');


// constantes
define('SQL_PREFIX', 'game_');


$session = new Session();
/**
* GESTION DES REQUETES AJAX
* Valeur de retour par défaut
*/
if(isset($_GET['type'])){
    $result = [];
    $result['status'] = 0;
    $result['comment'] = '';
    $result['response'] = [];
    $result['notifications'] = [];

    // le type de formulaire
    $type = htmlentities($_GET['type']);

    $path = './backend/actions/' . $type . '.php';

    if(file_exists($path)){
        include($path);
    }

    echo json_encode($result);
    die();
}
