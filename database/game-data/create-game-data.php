<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST');

    $dsn = 'mysql:host=mysql_db;dbname=diplom_chess';
    $user = 'root';
    $password = 'rootpass';

    $roomName = $_POST['roomName'];
    $data = $_POST['data'];
    
    $dbh = new PDO($dsn, $user, $password);

    $sql = 'INSERT INTO `game-data` (`data`, `room-name`) VALUES (?, ?)';
    $stmt= $dbh->prepare($sql);
    $stmt->execute([$data, $roomName]);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
?>