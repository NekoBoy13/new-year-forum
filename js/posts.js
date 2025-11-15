class PostsManager {
    constructor() {
        this.posts = [];
    }

    async createPost(content, imageFile = null) {
        try {
            console.log('Creating post with content:', content.substring(0, 50) + '...');
            
            const formData = new FormData();
            formData.append('content', content);
            if (imageFile) {
                console.log('Adding image file:', imageFile.name);
                formData.append('image', imageFile);
            }

            const response = await fetch('api/posts.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            console.log('Server response:', result);
            return result;
            
        } catch (error) {
            console.error('Error in createPost:', error);
            return { success: false, error: error.message };
        }
    }

    async getPosts() {
        try {
            const response = await fetch('api/posts.php');
            const result = await response.json();
            console.log('Loaded posts:', result.posts ? result.posts.length : 0);
            return result;
        } catch (error) {
            console.error('Error in getPosts:', error);
            return { success: false, error: error.message };
        }
    }

    async deletePost(postId) {
        try {
            console.log('Deleting post:', postId);
            
            const response = await fetch('api/posts.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    post_id: postId
                })
            });
            
            const result = await response.json();
            console.log('Delete response:', result);
            return result;
            
        } catch (error) {
            console.error('Error in deletePost:', error);
            return { success: false, error: error.message };
        }
    }

    displayPosts(posts, containerId, currentUserId = null) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        if (!posts || posts.length === 0) {
            container.innerHTML = '<div class="loading">🎄 Пока нет новогодних постов. Будьте первым!</div>';
            return;
        }

        console.log('Displaying posts:', posts.length);
        container.innerHTML = posts.map(post => this.createPostHTML(post, currentUserId)).join('');
        
        // Добавляем обработчики событий для кнопок удаления
        this.addDeleteEventListeners();
    }

    createPostHTML(post, currentUserId = null) {
        const postDate = post.created_at_formatted || 
                        (post.created_at ? new Date(post.created_at).toLocaleString('ru-RU') : 'Только что');
        
        // Проверяем, может ли текущий пользователь удалить пост
        const canDelete = currentUserId && post.user_id == currentUserId;
        
        return `
            <div class="post" data-post-id="${post.id}">
                <div class="post-header">
                    <div class="post-user-info">
                        <span class="post-username">🎅 ${post.username || 'Аноним'}</span>
                        <span class="post-date">${postDate}</span>
                    </div>
                    ${canDelete ? `
                        <button class="btn-delete" onclick="postsManager.handleDeletePost(${post.id})" 
                                title="Удалить пост">🗑️</button>
                    ` : ''}
                </div>
                <div class="post-content">
                    ${post.content || 'Нет содержимого'}
                </div>
                ${post.image_url ? `
                    <img src="${post.image_url}" alt="Новогоднее изображение" class="post-image" 
                         onerror="this.style.display='none'">
                ` : ''}
            </div>
        `;
    }

    async handleDeletePost(postId) {
        if (!confirm('🎄 Вы уверены, что хотите удалить этот пост?')) {
            return;
        }

        const result = await this.deletePost(postId);
        
        if (result.success) {
            showMessage('✅ Пост успешно удален!', 'success');
            // Удаляем пост из DOM
            const postElement = document.querySelector(`[data-post-id="${postId}"]`);
            if (postElement) {
                postElement.remove();
            }
            // Перезагружаем посты через 1 секунду
            setTimeout(() => {
                if (typeof loadPosts === 'function') {
                    loadPosts();
                }
                if (typeof loadUserPosts === 'function') {
                    loadUserPosts();
                }
            }, 1000);
        } else {
            showMessage(`❌ Ошибка удаления: ${result.error}`, 'error');
        }
    }

    addDeleteEventListeners() {
        // Обработчики уже добавлены через onclick в HTML
        // Этот метод оставлен для будущего расширения
    }
}

// Создаем глобальный экземпляр менеджера постов
const postsManager = new PostsManager();