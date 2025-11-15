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
    <title>Профиль - Новогодний Форум</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="snowflakes" aria-hidden="true">
        <!-- снежинки -->
    </div>

    <header class="header">
        <div class="container">
            <h1 class="logo">🎅 Ваш Профиль</h1>
            <nav class="nav">
                <span class="user-greeting">Привет, <?php echo htmlspecialchars($_SESSION['username']); ?>!</span>
                <a href="index.php" class="nav-link">Главная</a>
                <a href="create.php" class="nav-link">Написать пост</a>
                <button onclick="logout()" class="btn btn-outline">Выйти</button>
            </nav>
        </div>
    </header>

    <main class="container">
        <div id="profile-content">
            <div class="form-container">
                <h2 class="form-title">Ваш профиль</h2>
                <div class="user-info">
                    <p><strong>Имя пользователя:</strong> <?php echo htmlspecialchars($_SESSION['username']); ?></p>
                    <p><strong>ID пользователя:</strong> <?php echo $_SESSION['user_id']; ?></p>
                </div>
            </div>
            
            <div class="posts-container">
                <h2>🎁 Ваши посты</h2>
                <div id="user-posts" class="posts-list">
                    <div class="loading">Загрузка ваших постов...</div>
                </div>
            </div>
        </div>
    </main>

<script src="js/auth.js"></script>
<script src="js/posts.js"></script>
<script src="js/main.js"></script>
    <script>
        async function logout() {
            const response = await fetch('api/auth.php?action=logout');
            window.location.href = 'index.php';
        }
        
        // Загружаем посты пользователя
        document.addEventListener('DOMContentLoaded', function() {
            loadUserPosts();
        });
        
    async function loadUserPosts() {
        const postsList = document.getElementById('user-posts');
        const result = await postsManager.getPosts();
        
        if (result.success) {
            // Фильтруем посты текущего пользователя
            const userPosts = result.posts.filter(post => post.user_id == <?php echo $_SESSION['user_id']; ?>);
            // Передаем ID пользователя для отображения кнопок удаления
            postsManager.displayPosts(userPosts, 'user-posts', <?php echo $_SESSION['user_id']; ?>);
        } else {
            postsList.innerHTML = `<div class="error">Ошибка загрузки постов: ${result.error}</div>`;
        }
    }
    </script>
</body>
</html>