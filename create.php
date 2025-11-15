<?php session_start(); 
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Создать пост - Новогодний Форум</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="snowflakes" aria-hidden="true">
        <!-- снежинки -->
    </div>

    <header class="header">
        <div class="container">
            <h1 class="logo">🎅 Новогодний Пост</h1>
            <nav class="nav">
                <span class="user-greeting">Привет, <?php echo htmlspecialchars($_SESSION['username']); ?>!</span>
                <a href="index.php" class="nav-link">Главная</a>
                <a href="profile.php" class="nav-link">Профиль</a>
                <button onclick="logout()" class="btn btn-outline">Выйти</button>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="form-container">
            <h2 class="form-title">Поделитесь новогодним настроением! 🎄</h2>
<form id="create-post-form" enctype="multipart/form-data">
    <div class="form-group">
        <label class="form-label" for="content">Ваше сообщение:</label>
        <textarea id="content" name="content" class="form-textarea" 
                  placeholder="Расскажите о своих новогодних планах, поделитесь рецептом оливье или просто поздоровайтесь!"></textarea>
    </div>
    
    <div class="form-group">
        <label class="form-label" for="image">Добавить изображение (опционально):</label>
        <input type="file" id="image" name="image" class="form-file" accept="image/*">
        <small style="display: block; margin-top: 0.5rem; color: #666;">
            Поддерживаются: JPG, PNG, GIF (макс. 5MB)
        </small>
    </div>
    
    <button type="submit" class="btn btn-primary" style="width: 100%;">
        Опубликовать
    </button>
</form>
        </div>
    </main>

    <!-- ДОБАВЬТЕ ЭТИ СКРИПТЫ -->
    <script src="js/auth.js"></script>
    <script src="js/posts.js"></script>
    <script src="js/main.js"></script>
    
    <script>
        async function logout() {
            const response = await fetch('api/auth.php?action=logout');
            window.location.href = 'index.php';
        }
    </script>
</body>
</html>