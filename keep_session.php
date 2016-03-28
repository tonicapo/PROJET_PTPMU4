<?php 
    if($_COOKIE['email'])
    {
        session_start();
        echo "Session actualisée !<br />";
        var_dump($_COOKIE);
    }
?>