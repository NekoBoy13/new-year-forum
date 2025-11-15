class PostsManager {
    constructor() {
        this.posts = [];
    }

    async createPost(content, imageFile = null) {
        try {
            if (!authManager.isAuthenticated()) {
                throw new Error('Для создания поста необходимо авторизоваться');
            }

            let imageUrl = null;

            // Загружаем изображение если есть
            if (imageFile) {
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { data, error } = await supabase.storage
                    .from('post-images')
                    .upload(fileName, imageFile);

                if (error) throw error;

                // Получаем публичный URL
                const { data: urlData } = supabase.storage
                    .from('post-images')
                    .getPublicUrl(fileName);

                imageUrl = urlData.publicUrl;
            }

            // Создаем пост в базе данных
            const { data, error } = await supabase
                .from('posts')
                .insert([
                    {
                        user_id: authManager.getCurrentUser().id,
                        username: authManager.getUsername(),
                        content: content,
                        image_url: imageUrl
                    }
                ])
                .select();

            if (error) throw error;

            return { success: true, post: data[0] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getPosts() {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            this.posts = data || [];
            return { success: true, posts: this.posts };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getUserPosts(userId) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { success: true, posts: data || [] };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    displayPosts(posts, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (posts.length === 0) {
            container.innerHTML = '<div class="loading">Пока нет постов. Будьте первым!</div>';
            return;
        }

        container.innerHTML = posts.map(post => this.createPostHTML(post)).join('');
    }

    createPostHTML(post) {
        const postDate = new Date(post.created_at).toLocaleString('ru-RU');
        
        return `
            <div class="post">
                <div class="post-header">
                    <span class="post-username">🎅 ${post.username}</span>
                    <span class="post-date">${postDate}</span>
                </div>
                <div class="post-content">
                    ${post.content}
                </div>
                ${post.image_url ? `
                    <img src="${post.image_url}" alt="Изображение поста" class="post-image" 
                         onerror="this.style.display='none'">
                ` : ''}
            </div>
        `;
    }
}

// Создаем глобальный экземпляр менеджера постов
const postsManager = new PostsManager();