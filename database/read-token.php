<?php
    header('Access-Control-Allow-Origin: *');

    header('Access-Control-Allow-Methods: GET, POST');
    if (!file_exists(__DIR__ . 'vendor/autoload.php')) {
        require __DIR__ . '/vendor/autoload.php';
    } else {
        require __DIR__ . 'vendor/autoload.php';
    }
    use \Firebase\JWT\JWT; 
    use \Firebase\JWT\Key; 
    $token = $_POST['token'];
    $key = "key123123";

    try {
        $decoded = JWT::decode($token, new Key($key, 'HS256'));
        $payload = array(
            "username" => $decoded -> username,
            "password" => $decoded -> password,
            "exp" => time() + 60*60*10  // 10 minutes
        );
        $token = JWT::encode($payload, $key, 'HS256');
        echo  json_encode($token);
    }
    catch (Exception $e) {
        echo json_encode(false);
    }
?> 