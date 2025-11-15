class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    async init() {
        // Проверяем текущую сессию при загрузке
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
            this.currentUser = session.user;
            this.updateUI();
        }
        
        // Слушаем изменения авторизации
        supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session) {
                this.currentUser = session.user;
                this.updateUI();
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.updateUI();
            }
        });
    }

    async signUp(email, password, username) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (error) throw error;

            // Сохраняем username в метаданных пользователя
            if (data.user) {
                const { error: updateError } = await supabase.auth.updateUser({
                    data: { username: username }
                });
                if (updateError) console.error('Error updating user data:', updateError);
            }

            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            this.currentUser = data.user;
            this.updateUI();
            return { success: true, user: data.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            
            this.currentUser = null;
            this.updateUI();
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    updateUI() {
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const userGreeting = document.getElementById('user-greeting');
        const createPostLinks = document.querySelectorAll('a[href="create.html"]');
        const profileLinks = document.querySelectorAll('a[href="profile.html"]');

        if (this.currentUser) {
            // Пользователь авторизован
            if (loginBtn) loginBtn.style.display = 'none';
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (userGreeting) {
                const username = this.currentUser.user_metadata?.username || this.currentUser.email;
                userGreeting.textContent = `Привет, ${username}!`;
            }
            
            // Активируем ссылки для авторизованных пользователей
            createPostLinks.forEach(link => {
                link.style.pointerEvents = 'auto';
                link.style.opacity = '1';
            });
        } else {
            // Пользователь не авторизован
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (userGreeting) userGreeting.textContent = '';
            
            // Деактивируем ссылки для неавторизованных
            createPostLinks.forEach(link => {
                link.style.pointerEvents = 'none';
                link.style.opacity = '0.5';
            });
        }
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getUsername() {
        return this.currentUser?.user_metadata?.username || this.currentUser?.email || 'Аноним';
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