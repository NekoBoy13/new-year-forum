<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Регистрация - Новогодний Форум</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="snowflakes" aria-hidden="true">
        <!-- снежинки -->
    </div>

    <header class="header">
        <div class="container">
            <h1 class="logo">🎅 Регистрация</h1>
            <nav class="nav">
                <a href="index.php" class="nav-link">На главную</a>
                <a href="login.php" class="nav-link">Войти</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="form-container">
            <h2 class="form-title">Создать аккаунт</h2>
            <form id="register-form">
                <div class="form-group">
                    <label class="form-label" for="username">Имя пользователя:</label>
                    <input type="text" id="username" name="username" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="email">Email:</label>
                    <input type="email" id="email" name="email" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="password">Пароль:</label>
                    <input type="password" id="password" name="password" class="form-input" required minlength="6">
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="confirmPassword">Подтвердите пароль:</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" class="form-input" required>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Зарегистрироваться
                </button>
            </form>
            
            <p style="text-align: center; margin-top: 1rem;">
                Уже есть аккаунт? <a href="login.php" style="color: var(--christmas-green);">Войти</a>
            </p>
        </div>
    </main>

<script src="js/auth.js"></script>
<script src="js/posts.js"></script>
<script src="js/main.js"></script>
</body>
</html>