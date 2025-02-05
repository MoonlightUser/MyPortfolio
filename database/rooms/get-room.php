<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST');

    $dsn = 'mysql:host=mysql_db;dbname=diplom_chess';
    $user = 'root';
    $password = 'rootpass';

    $roomName = $_POST['roomName'];
    
    $dbh = new PDO($dsn, $user, $password);

    $sql = 'SELECT * FROM `rooms` WHERE `room-name`=?';
    $stmt= $dbh->prepare($sql);
    $stmt->execute([$roomName]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
?>