<?php
unset($_SESSION['user_id']);
setcookie('email', '', -1);
setcookie('password', '', -1);
header('Location:index.html');
