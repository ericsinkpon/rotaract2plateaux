// Scripts pour l'interface d'administration

// Vérifier si l'utilisateur est connecté
function checkAdminAuth() {
    const isAuthenticated = sessionStorage.getItem('admin_authenticated') === 'true';
    if (!isAuthenticated && !window.location.pathname.includes('admin-login.html')) {
        window.location.href = 'admin-login.html';
    }
}

// Fonction de connexion
function loginAdmin(password) {
    if (DataManager.checkPassword(password)) {
        sessionStorage.setItem('admin_authenticated', 'true');
        return true;
    }
    return false;
}

// Fonction de déconnexion
function logoutAdmin() {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = 'admin-login.html';
}

// Formater une date pour l'affichage
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Afficher un message de notification
function showNotification(message, type = 'success') {
    const alertClass = type === 'success' ? 'alert-success' : 'alert-danger';
    const notification = `
        <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    const container = document.getElementById('notification-container');
    if (container) {
        container.innerHTML = notification;
        setTimeout(() => {
            const alert = container.querySelector('.alert');
            if (alert) {
                alert.classList.remove('show');
            }
        }, 3000);
    }
}

// Valider une image (vérifier si c'est une URL valide)
function isValidImageUrl(url) {
    return url && (url.startsWith('http') || url.startsWith('images/') || url.startsWith('/images/'));
}

