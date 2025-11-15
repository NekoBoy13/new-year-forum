<?php session_start(); ?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Вход - Новогодний Форум</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="snowflakes" aria-hidden="true">
        <!-- снежинки -->
    </div>

    <header class="header">
        <div class="container">
            <h1 class="logo">🎅 Вход в аккаунт</h1>
            <nav class="nav">
                <a href="index.php" class="nav-link">На главную</a>
                <a href="register.php" class="nav-link">Регистрация</a>
            </nav>
        </div>
    </header>

    <main class="container">
        <div class="form-container">
            <h2 class="form-title">Войти в аккаунт</h2>
            <form id="login-form">
                <div class="form-group">
                    <label class="form-label" for="email">Email:</label>
                    <input type="email" id="email" name="email" class="form-input" required>
                </div>
                
                <div class="form-group">
                    <label class="form-label" for="password">Пароль:</label>
                    <input type="password" id="password" name="password" class="form-input" required>
                </div>
                
                <button type="submit" class="btn btn-primary" style="width: 100%;">
                    Войти
                </button>
            </form>
            
            <p style="text-align: center; margin-top: 1rem;">
                Нет аккаунта? <a href="register.php" style="color: var(--christmas-green);">Зарегистрироваться</a>
            </p>
        </div>
    </main>

<script src="js/auth.js"></script>
<script src="js/posts.js"></script>
<script src="js/main.js"></script>
</body>
</html>