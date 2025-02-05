<?php
    header("Access-Control-Allow-Origin: *");

    // Enable error reporting
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    $dsn = 'mysql:host=mysql_db;dbname=diplom_chess';
    $user = 'root';
    $password = 'rootpass';

    $dbh = new PDO($dsn, $user, $password);

    $sth_users = $dbh->query('SELECT * FROM `users`');  
    $users = $sth_users->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
?>