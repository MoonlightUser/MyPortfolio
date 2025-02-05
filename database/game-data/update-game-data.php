<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST');

    $dsn = 'mysql:host=mysql_db;dbname=diplom_chess';
    $user = 'root';
    $password = 'rootpass';

    $roomName = $_POST['roomName'];
    $data = $_POST['data'];

    $pdo = new PDO($dsn, $user, $password);

    $sql = "UPDATE `game-data` SET `data` = ? WHERE `room-name` = ?";
    $pdo->prepare($sql)->execute([$data, $roomName]);
    echo json_encode("success");
?>