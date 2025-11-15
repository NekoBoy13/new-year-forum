// Основной файл с общими функциями
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация обратного отсчета
    initCountdown();
    
    // Загрузка постов на главной странице
    if (document.getElementById('posts-list')) {
        loadPosts();
    }
    
    // Инициализация форм
    initForms();
});

// Обратный отсчет до Нового года
function initCountdown() {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    function updateCountdown() {
        const now = new Date();
        const newYear = new Date(now.getFullYear() + 1, 0, 1); // 1 января следующего года
        const diff = newYear - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = days.toString().padStart(2, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Загрузка постов
async function loadPosts() {
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;

    postsList.innerHTML = '<div class="loading">Загрузка постов... 🎄</div>';

    const result = await postsManager.getPosts();
    
    if (result.success) {
        postsManager.displayPosts(result.posts, 'posts-list');
    } else {
        postsList.innerHTML = `<div class="error">Ошибка загрузки постов: ${result.error}</div>`;
    }
}

// Инициализация форм
function initForms() {
    // Форма регистрации
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Форма входа
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Форма создания поста
    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
        
        // Проверяем авторизацию
        if (!authManager.isAuthenticated()) {
            createPostForm.innerHTML = `
                <div class="error">
                    Для создания поста необходимо <a href="login.html" style="color: white; text-decoration: underline;">войти</a>
                </div>
            `;
        }
    }
}

// Обработчики форм
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
        showMessage('Пароли не совпадают!', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Регистрация...';

    const result = await authManager.signUp(email, password, username);
    
    if (result.success) {
        showMessage('Регистрация успешна! Проверьте вашу почту для подтверждения.', 'success');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    } else {
        showMessage(`Ошибка регистрации: ${result.error}`, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зарегистрироваться';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';

    const result = await authManager.signIn(email, password);
    
    if (result.success) {
        showMessage('Вход успешен!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage(`Ошибка входа: ${result.error}`, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
    }
}

async function handleCreatePost(e) {
    e.preventDefault();
    
    if (!authManager.isAuthenticated()) {
        showMessage('Для создания поста необходимо авторизоваться!', 'error');
        return;
    }

    const formData = new FormData(e.target);
    const content = formData.get('content');
    const imageFile = formData.get('image')?.files[0];

    if (!content.trim()) {
        showMessage('Введите текст поста!', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Публикация...';

    const result = await postsManager.createPost(content, imageFile);
    
    if (result.success) {
        showMessage('Пост успешно опубликован!', 'success');
        e.target.reset();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } else {
        showMessage(`Ошибка публикации: ${result.error}`, 'error');
    }
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Опубликовать';
}

// Вспомогательная функция для показа сообщений
function showMessage(message, type = 'info') {
    // Удаляем предыдущие сообщения
    const existingMessages = document.querySelectorAll('.message-temp');
    existingMessages.forEach(msg => msg.remove());

    // Создаем новое сообщение
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-temp ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        color: white;
        z-index: 1000;
        max-width: 300px;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'error') {
        messageDiv.style.background = 'var(--christmas-red)';
    } else if (type === 'success') {
        messageDiv.style.background = 'var(--christmas-green)';
    } else {
        messageDiv.style.background = 'var(--winter-blue)';
    }
    
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Автоматически удаляем через 5 секунд
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);