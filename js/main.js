// В начале файла main.js добавьте
if (typeof postsManager === 'undefined') {
    console.error('postsManager is not defined!');
}

if (typeof authManager === 'undefined') {
    console.warn('authManager is not defined (this is OK on create.php)');
}

// Основной файл с общими функциями
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Инициализация обратного отсчета
    initCountdown();
    
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

        if (document.getElementById('days')) {
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Загрузка постов
async function loadPosts() {
    const postsList = document.getElementById('posts-list');
    if (!postsList) return;

    postsList.innerHTML = '<div class="loading">🎅 Загрузка новогодних постов...</div>';

    const result = await postsManager.getPosts();
    
    if (result.success) {
        postsManager.displayPosts(result.posts, 'posts-list');
    } else {
        postsList.innerHTML = `<div class="error">❌ Ошибка загрузки постов: ${result.error}</div>`;
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
    }
}

// Обработчики форм
async function handleRegister(e) {
    e.preventDefault();
    console.log('Registration form submitted');
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const username = formData.get('username');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
        showMessage('🔒 Пароли не совпадают!', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Регистрация...';

    const result = await authManager.signUp(email, password, username);
    
    if (result.success) {
        showMessage('🎉 Регистрация успешна! Добро пожаловать!', 'success');
        setTimeout(() => {
            window.location.href = 'index.php';
        }, 2000);
    } else {
        showMessage(`❌ Ошибка регистрации: ${result.error}`, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зарегистрироваться';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Вход...';

    const result = await authManager.signIn(email, password);
    
    if (result.success) {
        showMessage('🎉 Вход успешен!', 'success');
        setTimeout(() => {
            window.location.href = 'index.php';
        }, 1000);
    } else {
        showMessage(`❌ Ошибка входа: ${result.error}`, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Войти';
    }
}

async function handleCreatePost(e) {
    e.preventDefault();
    console.log('Create post form submitted');

    // Получаем форму и элементы правильно
    const form = e.target;
    const contentTextarea = form.querySelector('textarea[name="content"]');
    const imageInput = form.querySelector('input[name="image"]');
    
    const content = contentTextarea ? contentTextarea.value : '';
    const imageFile = imageInput && imageInput.files.length > 0 ? imageInput.files[0] : null;

    console.log('Content:', content);
    console.log('Image file:', imageFile);

    if (!content.trim()) {
        showMessage('📝 Введите текст поста!', 'error');
        return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Публикация...';

    try {
        // Используем postsManager напрямую
        const result = await postsManager.createPost(content, imageFile);
        
        if (result.success) {
            showMessage('🎄 Пост успешно опубликован!', 'success');
            form.reset();
            setTimeout(() => {
                window.location.href = 'index.php';
            }, 2000);
        } else {
            showMessage(`❌ Ошибка публикации: ${result.error}`, 'error');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Опубликовать';
        }
    } catch (error) {
        console.error('Error in handleCreatePost:', error);
        showMessage(`❌ Ошибка: ${error.message}`, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Опубликовать';
    }
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
        font-weight: bold;
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

// Делаем функции глобальными для доступа из других файлов
// Делаем функции глобальными для доступа из других файлов
window.loadPosts = loadPosts;
window.authManager = authManager;
window.postsManager = postsManager;
window.showMessage = showMessage; // Добавляем эту строку