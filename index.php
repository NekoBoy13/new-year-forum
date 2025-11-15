<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🎄 Новогодний Форум 2024</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="snowflakes" aria-hidden="true">
        <div class="snowflake">❅</div>
        <div class="snowflake">❅</div>
        <div class="snowflake">❆</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❅</div>
        <div class="snowflake">❆</div>
        <div class="snowflake">❄</div>
        <div class="snowflake">❅</div>
        <div class="snowflake">❆</div>
        <div class="snowflake">❄</div>
    </div>

    <header class="header">
        <div class="container">
            <h1 class="logo">🎅 Новогодний Форум 2024</h1>
            <nav class="nav">
                <?php if (isset($_SESSION['user_id'])): ?>
                    <span id="user-greeting" class="user-greeting">Привет, <?php echo htmlspecialchars($_SESSION['username']); ?>!</span>
                    <a href="index.php" class="nav-link">Главная</a>
                    <a href="create.php" class="nav-link">Написать пост</a>
                    <a href="profile.php" class="nav-link">Профиль</a>
                    <button onclick="logout()" class="btn btn-outline">Выйти</button>
                <?php else: ?>
                    <a href="index.php" class="nav-link">Главная</a>
                    <a href="login.php" class="btn btn-primary">Войти</a>
                    <a href="register.php" class="btn btn-outline">Регистрация</a>
                <?php endif; ?>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="new-year-countdown">
            <h2>До Нового 2025 года осталось:</h2>
            <div id="countdown" class="countdown">
                <div class="countdown-item">
                    <span id="days">0</span>
                    <small>дней</small>
                </div>
                <div class="countdown-item">
                    <span id="hours">0</span>
                    <small>часов</small>
                </div>
                <div class="countdown-item">
                    <span id="minutes">0</span>
                    <small>минут</small>
                </div>
                <div class="countdown-item">
                    <span id="seconds">0</span>
                    <small>секунд</small>
                </div>
            </div>
        </div>

        <div class="posts-container">
            <h2>🎁 Последние новогодние посты</h2>
            <div id="posts-list" class="posts-list">
                <div class="loading">Загрузка постов... 🎄</div>
            </div>
        </div>
    </main>

    <footer class="footer">
        <div class="container">
            <p>С наступающим Новым Годом! 🎄</p>
        </div>
    </footer>

<script src="js/auth.js"></script>
<script src="js/posts.js"></script>
<script src="js/main.js"></script>
    <script>
        async function logout() {
            const response = await fetch('api/auth.php?action=logout');
            window.location.href = 'index.php';
        }
        
        // Загружаем посты при загрузке страницы
        document.addEventListener('DOMContentLoaded', function() {
            loadPosts();
        });
        
        // Обновляем функцию loadPosts
        async function loadPosts() {
            const postsList = document.getElementById('posts-list');
            if (!postsList) return;

            postsList.innerHTML = '<div class="loading">🎅 Загрузка новогодних постов...</div>';

            const result = await postsManager.getPosts();
            
            if (result.success) {
                // Передаем ID текущего пользователя для отображения кнопок удаления
                const currentUserId = <?php echo isset($_SESSION['user_id']) ? $_SESSION['user_id'] : 'null'; ?>;
                postsManager.displayPosts(result.posts, 'posts-list', currentUserId);
            } else {
                postsList.innerHTML = `<div class="error">❌ Ошибка загрузки постов: ${result.error}</div>`;
            }
        }
    </script>
</body>
</html>