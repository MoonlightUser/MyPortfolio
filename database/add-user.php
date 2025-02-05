<?php
    header("Access-Control-Allow-Origin: *");
    header('Access-Control-Allow-Methods: GET, POST');
    header("Content-Type: application/json; charset=UTF-8");

    // Enable error reporting
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    $dsn = 'mysql:host=mysql_db;dbname=diplom_chess';
    $user = 'root';
    $password = 'rootpass';

    try {
        $dbh = new PDO($dsn, $user, $password);
        $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $userName = $_POST['username'];
        $userPassword = $_POST['password'];
        $userEmail = $_POST['email'];

        $sql = 'INSERT INTO `users` (`name`, `password`, `email`) VALUES (?, ?, ?)';
        $stmt = $dbh->prepare($sql);
        $stmt->execute([$userName, $userPassword, $userEmail]);

        echo json_encode(['success' => true, 'message' => 'User added successfully']);
    } catch (PDOException $e) {
        error_log($e->getMessage(), 3, 'error_log.log');
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
?>