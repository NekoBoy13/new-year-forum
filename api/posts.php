<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

session_start();
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Создание поста (оставляем существующий код)
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Не авторизован']);
        exit;
    }
    
    $content = trim($_POST['content']);
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    
    if (empty($content)) {
        echo json_encode(['success' => false, 'error' => 'Текст поста не может быть пустым']);
        exit;
    }
    
    $image_filename = null;
    if (isset($_FILES['image']) && $_FILES['image']['error'] === 0) {
        // Проверяем тип файла
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
        $file_type = $_FILES['image']['type'];
        
        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(['success' => false, 'error' => 'Разрешены только JPG, PNG и GIF изображения']);
            exit;
        }
        
        // Проверяем размер файла (5MB)
        if ($_FILES['image']['size'] > 5 * 1024 * 1024) {
            echo json_encode(['success' => false, 'error' => 'Размер файла не должен превышать 5MB']);
            exit;
        }
        
        $upload_dir = '../uploads/';
        if (!is_dir($upload_dir)) {
            mkdir($upload_dir, 0777, true);
        }
        
        $image_filename = uniqid() . '_' . basename($_FILES['image']['name']);
        $upload_path = $upload_dir . $image_filename;
        
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $upload_path)) {
            echo json_encode(['success' => false, 'error' => 'Ошибка загрузки изображения']);
            exit;
        }
    }
    
    $query = "INSERT INTO posts SET user_id=:user_id, username=:username, content=:content, image_filename=:image_filename";
    $stmt = $db->prepare($query);
    
    if ($stmt->execute([
        'user_id' => $user_id,
        'username' => $username,
        'content' => $content,
        'image_filename' => $image_filename
    ])) {
        echo json_encode(['success' => true, 'message' => 'Пост успешно создан']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Ошибка создания поста']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Удаление поста
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Не авторизован']);
        exit;
    }
    
    $input = json_decode(file_get_contents("php://input"), true);
    $post_id = $input['post_id'] ?? null;
    $user_id = $_SESSION['user_id'];
    
    if (!$post_id) {
        echo json_encode(['success' => false, 'error' => 'ID поста не указан']);
        exit;
    }
    
    // Проверяем, принадлежит ли пост пользователю
    $checkQuery = "SELECT user_id, image_filename FROM posts WHERE id = :post_id";
    $checkStmt = $db->prepare($checkQuery);
    $checkStmt->execute(['post_id' => $post_id]);
    $post = $checkStmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$post) {
        echo json_encode(['success' => false, 'error' => 'Пост не найден']);
        exit;
    }
    
    // Проверяем права доступа (только автор может удалять)
    if ($post['user_id'] != $user_id) {
        echo json_encode(['success' => false, 'error' => 'Вы можете удалять только свои посты']);
        exit;
    }
    
    // Удаляем изображение если есть
    if ($post['image_filename']) {
        $image_path = '../uploads/' . $post['image_filename'];
        if (file_exists($image_path)) {
            unlink($image_path);
        }
    }
    
    // Удаляем пост из базы
    $deleteQuery = "DELETE FROM posts WHERE id = :post_id";
    $deleteStmt = $db->prepare($deleteQuery);
    
    if ($deleteStmt->execute(['post_id' => $post_id])) {
        echo json_encode(['success' => true, 'message' => 'Пост успешно удален']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Ошибка удаления поста']);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Получение постов (оставляем существующий код)
    $query = "SELECT * FROM posts ORDER BY created_at DESC";
    $stmt = $db->prepare($query);
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Добавляем полный URL для изображений
    foreach ($posts as &$post) {
        if ($post['image_filename']) {
            $post['image_url'] = 'http://localhost/new-year-forum/uploads/' . $post['image_filename'];
        }
        // Форматируем дату
        $post['created_at_formatted'] = date('d.m.Y H:i', strtotime($post['created_at']));
    }
    
    echo json_encode(['success' => true, 'posts' => $posts]);
}
?>