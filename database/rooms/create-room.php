<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST');

    $dsn = 'mysql:host=mysql_db;dbname=diplom_chess';
    $user = 'root';
    $password = 'rootpass';

    $roomName = $_POST['roomName'];
    $roomPassword = $_POST['roomPassword'];
    
    $dbh = new PDO($dsn, $user, $password);

    $sql = 'INSERT INTO `rooms` (`room-name`, `user-name`, `status`, `password`) VALUES (?, ?, ?, ?)';
    $stmt= $dbh->prepare($sql);
    $stmt->execute([$roomName, "", 100, $roomPassword]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($result);
?>