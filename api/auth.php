<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"));
    
    if (isset($data->action)) {
        if ($data->action === 'register') {
            // Регистрация
            $email = trim($data->email);
            $username = trim($data->username);
            $password = $data->password;
            
            // Проверяем существование пользователя
            $checkQuery = "SELECT id FROM users WHERE email = :email";
            $checkStmt = $db->prepare($checkQuery);
            $checkStmt->execute(['email' => $email]);
            
            if ($checkStmt->fetch()) {
                echo json_encode(['success' => false, 'error' => 'Пользователь с таким email уже существует']);
                exit;
            }
            
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            $query = "INSERT INTO users SET email=:email, username=:username, password_hash=:password_hash";
            $stmt = $db->prepare($query);
            
            if ($stmt->execute(['email' => $email, 'username' => $username, 'password_hash' => $password_hash])) {
                $_SESSION['user_id'] = $db->lastInsertId();
                $_SESSION['username'] = $username;
                echo json_encode(['success' => true, 'message' => 'Регистрация успешна', 'user' => [
                    'id' => $_SESSION['user_id'],
                    'username' => $username,
                    'email' => $email
                ]]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Ошибка регистрации']);
            }
            
        } elseif ($data->action === 'login') {
            // Вход
            $email = trim($data->email);
            $password = $data->password;
            
            $query = "SELECT * FROM users WHERE email = :email";
            $stmt = $db->prepare($query);
            $stmt->execute(['email' => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user && password_verify($password, $user['password_hash'])) {
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                echo json_encode(['success' => true, 'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email']
                ]]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Неверный email или пароль']);
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action'])) {
    if ($_GET['action'] === 'check_auth') {
        // Проверка авторизации
        if (isset($_SESSION['user_id'])) {
            echo json_encode(['authenticated' => true, 'user' => [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username']
            ]]);
        } else {
            echo json_encode(['authenticated' => false]);
        }
    } elseif ($_GET['action'] === 'logout') {
        // Выход
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Выход выполнен']);
    }
}
?>