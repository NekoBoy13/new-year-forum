class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Проверяем авторизацию при загрузке
        try {
            const response = await fetch('api/auth.php?action=check_auth');
            const result = await response.json();
            
            if (result.authenticated) {
                this.currentUser = result.user;
                this.updateUI();
            }
        } catch (error) {
            console.error('Auth check error:', error);
        }
    }

    async signUp(email, password, username) {
        try {
            const response = await fetch('api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'register',
                    email: email,
                    password: password,
                    username: username
                })
            });
            
            const result = await response.json();
            if (result.success) {
                this.currentUser = result.user;
                this.updateUI();
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const response = await fetch('api/auth.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    email: email,
                    password: password
                })
            });
            
            const result = await response.json();
            if (result.success) {
                this.currentUser = result.user;
                this.updateUI();
            }
            return result;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            await fetch('api/auth.php?action=logout');
            this.currentUser = null;
            this.updateUI();
            window.location.href = 'index.php';
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userGreeting = document.getElementById('user-greeting');

        if (this.currentUser) {
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (userGreeting) {
                userGreeting.textContent = `Привет, ${this.currentUser.username}!`;
            }
        } else {
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userGreeting) userGreeting.textContent = '';
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUsername() {
        return this.currentUser?.username || 'Аноним';
    }
}

// Создаем глобальный экземпляр менеджера авторизации
const authManager = new AuthManager();

// Обработчик выхода
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => authManager.signOut());
    }
});