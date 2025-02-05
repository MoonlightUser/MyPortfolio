<?php
    header('Access-Control-Allow-Origin: *');

    header('Access-Control-Allow-Methods: GET, POST');
    if (!file_exists(__DIR__ . 'vendor/autoload.php')) {
        require __DIR__ . '/vendor/autoload.php';
    } else {
        require __DIR__ . 'vendor/autoload.php';
    }
    use \Firebase\JWT\JWT; 
    $username = $_POST['username'];
    $password = $_POST['password'];
    
    
    
    $key = "key123123";
    $payload = array(
        "username" => $username,
        "password" => $password,
        "exp" => time() + 60*60*10  // 10 hours
    );
    $jwt = JWT::encode($payload, $key, 'HS256');
    $jwt = json_encode($jwt);
    echo $jwt;
?> 