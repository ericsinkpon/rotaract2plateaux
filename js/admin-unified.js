// Script pour la page admin unifiée

// URL d'image pour affichage (uploads/... depuis la racine du site)
function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return path;
    const base = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    return base + path;
}

let currentActionId = null;
let currentActualiteId = null;

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', async function() {
    const auth = await API.checkAuth();
    if (auth.authenticated) {
        showAdminScreen(auth.username);
        loadStats();
        loadAllData();
    } else {
        showLoginScreen();
    }
});

// Afficher l'écran de connexion
function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminScreen').style.display = 'none';
}

// Afficher l'interface admin
function showAdminScreen(username) {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminScreen').style.display = 'block';
    document.getElementById('adminUsername').textContent = username;
}

// Connexion
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const result = await API.login(username, password);
    if (result.success) {
        showAdminScreen(username);
        loadStats();
        loadAllData();
    } else {
        showNotification(result.message || 'Identifiants incorrects', 'error');
    }
});

// Déconnexion
async function logout() {
    await API.logout();
    showLoginScreen();
    document.getElementById('loginForm').reset();
}

// Charger les statistiques
async function loadStats() {
    try {
        const [actions, actualites] = await Promise.all([
            API.getActions(),
            API.getActualites()
        ]);
        
        document.getElementById('stats-actions').textContent = actions.length || 0;
        document.getElementById('stats-actualites').textContent = actualites.length || 0;
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Charger toutes les données
async function loadAllData() {
    loadActions();
    loadActualites();
}

// ========== GESTION DES ACTIONS ==========

async function loadActions() {
    try {
        const actions = await API.getActions();
        const container = document.getElementById('actions-list');
        
        if (actions.length === 0) {
            container.innerHTML = '<p class="text-muted">Aucune action pour le moment.</p>';
            return;
        }
        
        container.innerHTML = actions.map(action => `
            <div class="item-card">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${getImageUrl(action.image || 'images/action.webp')}" class="item-image-preview w-100" alt="${action.titre}" onerror="this.onerror=null;this.src=getImageUrl('images/action.webp')">
                    </div>
                    <div class="col-md-7">
                        <h5>${action.titre}</h5>
                        <p class="text-muted">${action.description.substring(0, 150)}...</p>
                        <p><strong>Date:</strong> ${formatDate(action.date_activite)}</p>
                        ${action.montant_objectif > 0 ? `<p><strong>Objectif:</strong> ${parseFloat(action.montant_objectif).toLocaleString()} FCFA</p>` : ''}
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-sm btn-primary mb-2" onclick="editAction(${action.id})">
                            <i class="bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAction(${action.id})">
                            <i class="bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur lors du chargement des actions:', error);
    }
}

function openActionModal() {
    currentActionId = null;
    document.getElementById('actionForm').reset();
    document.getElementById('actionImage').value = '';
    document.getElementById('actionImageFile').value = '';
    document.getElementById('actionModalTitle').textContent = 'Ajouter une action';
    document.getElementById('actionImagePreview').innerHTML = '';
    new bootstrap.Modal(document.getElementById('actionModal')).show();
}

async function editAction(id) {
    try {
        const action = await API.getAction(id);
        if (action && !action.error) {
            currentActionId = id;
            document.getElementById('actionId').value = action.id;
            document.getElementById('actionTitre').value = action.titre;
            document.getElementById('actionDescription').value = action.description;
            document.getElementById('actionImage').value = action.image || '';
            document.getElementById('actionImageFile').value = '';
            document.getElementById('actionDate').value = action.date_activite;
            document.getElementById('actionMontantCollecte').value = action.montant_collecte || 0;
            document.getElementById('actionMontantObjectif').value = action.montant_objectif || 0;
            document.getElementById('actionCategorie').value = action.categorie || '';
            document.getElementById('actionModalTitle').textContent = 'Modifier l\'action';
            previewActionImage(action.image);
            new bootstrap.Modal(document.getElementById('actionModal')).show();
        }
    } catch (error) {
        showNotification('Erreur lors du chargement de l\'action', 'error');
    }
}

async function saveAction() {
    const form = document.getElementById('actionForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const fileInput = document.getElementById('actionImageFile');
    const hiddenImage = document.getElementById('actionImage');
    let imagePath = hiddenImage.value;

    if (fileInput.files && fileInput.files[0]) {
        try {
            imagePath = await API.uploadImage(fileInput.files[0]);
            if (!imagePath) throw new Error('Chemin image manquant');
            hiddenImage.value = imagePath;
        } catch (err) {
            showNotification(err.message || 'Erreur lors de l\'upload de l\'image', 'error');
            return;
        }
    } else if (!currentActionId && !imagePath) {
        showNotification('Veuillez sélectionner une image.', 'error');
        return;
    }

    const action = {
        id: currentActionId ? parseInt(currentActionId) : null,
        titre: document.getElementById('actionTitre').value,
        description: document.getElementById('actionDescription').value,
        image: imagePath || null,
        date_activite: document.getElementById('actionDate').value,
        montant_collecte: parseFloat(document.getElementById('actionMontantCollecte').value) || 0,
        montant_objectif: parseFloat(document.getElementById('actionMontantObjectif').value) || 0,
        categorie: document.getElementById('actionCategorie').value || null
    };

    try {
        await API.saveAction(action);
        bootstrap.Modal.getInstance(document.getElementById('actionModal')).hide();
        showNotification(currentActionId ? 'Action modifiée avec succès' : 'Action ajoutée avec succès');
        loadActions();
        loadStats();
    } catch (error) {
        showNotification('Erreur lors de l\'enregistrement', 'error');
    }
}

async function deleteAction(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette action ?')) {
        try {
            await API.deleteAction(id);
            showNotification('Action supprimée avec succès');
            loadActions();
            loadStats();
        } catch (error) {
            showNotification('Erreur lors de la suppression', 'error');
        }
    }
}

function previewActionImage(url) {
    const container = document.getElementById('actionImagePreview');
    if (url) {
        const src = getImageUrl(url);
        container.innerHTML = `
            <label class="form-label">Aperçu</label><br>
            <img src="${src}" class="item-image-preview" alt="Preview" onerror="this.style.display='none'">
        `;
    } else {
        container.innerHTML = '';
    }
}

document.getElementById('actionImageFile').addEventListener('change', function() {
    const container = document.getElementById('actionImagePreview');
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            container.innerHTML = '<label class="form-label">Aperçu</label><br><img src="' + e.target.result + '" class="item-image-preview" alt="Preview">';
        };
        reader.readAsDataURL(this.files[0]);
    } else {
        previewActionImage(document.getElementById('actionImage').value);
    }
});

// ========== GESTION DES ACTUALITÉS ==========

async function loadActualites() {
    try {
        const actualites = await API.getActualites();
        const container = document.getElementById('actualites-list');
        
        if (actualites.length === 0) {
            container.innerHTML = '<p class="text-muted">Aucune actualité pour le moment.</p>';
            return;
        }
        
        container.innerHTML = actualites.map(actualite => `
            <div class="item-card">
                <div class="row">
                    <div class="col-md-3">
                        <img src="${getImageUrl(actualite.image || 'images/action.webp')}" class="item-image-preview w-100" alt="${actualite.titre}" onerror="this.onerror=null;this.src=getImageUrl('images/action.webp')">
                    </div>
                    <div class="col-md-7">
                        <h5>${actualite.titre}</h5>
                        <p class="text-muted">${actualite.description.substring(0, 150)}...</p>
                        <p><strong>Date:</strong> ${formatDate(actualite.date_publication)}</p>
                        ${actualite.categorie ? `<p><strong>Catégorie:</strong> ${actualite.categorie}</p>` : ''}
                        ${actualite.auteur ? `<p><strong>Auteur:</strong> ${actualite.auteur}</p>` : ''}
                    </div>
                    <div class="col-md-2 text-end">
                        <button class="btn btn-sm btn-success mb-2" onclick="editActualite(${actualite.id})">
                            <i class="bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteActualite(${actualite.id})">
                            <i class="bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
    }
}

function openActualiteModal() {
    currentActualiteId = null;
    document.getElementById('actualiteForm').reset();
    document.getElementById('actualiteImage').value = '';
    document.getElementById('actualiteImageFile').value = '';
    document.getElementById('actualiteDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('actualiteModalTitle').textContent = 'Ajouter une actualité';
    document.getElementById('actualiteImagePreview').innerHTML = '';
    new bootstrap.Modal(document.getElementById('actualiteModal')).show();
}

async function editActualite(id) {
    try {
        const actualite = await API.getActualite(id);
        if (actualite && !actualite.error) {
            currentActualiteId = id;
            document.getElementById('actualiteId').value = actualite.id;
            document.getElementById('actualiteTitre').value = actualite.titre;
            document.getElementById('actualiteDescription').value = actualite.description;
            document.getElementById('actualiteContenu').value = actualite.contenu || '';
            document.getElementById('actualiteImage').value = actualite.image || '';
            document.getElementById('actualiteImageFile').value = '';
            document.getElementById('actualiteDate').value = actualite.date_publication;
            document.getElementById('actualiteCategorie').value = actualite.categorie || '';
            document.getElementById('actualiteAuteur').value = actualite.auteur || 'Par le Club';
            document.getElementById('actualiteModalTitle').textContent = 'Modifier l\'actualité';
            previewActualiteImage(actualite.image);
            new bootstrap.Modal(document.getElementById('actualiteModal')).show();
        }
    } catch (error) {
        showNotification('Erreur lors du chargement de l\'actualité', 'error');
    }
}

async function saveActualite() {
    const form = document.getElementById('actualiteForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const fileInput = document.getElementById('actualiteImageFile');
    const hiddenImage = document.getElementById('actualiteImage');
    let imagePath = hiddenImage.value;

    if (fileInput.files && fileInput.files[0]) {
        try {
            imagePath = await API.uploadImage(fileInput.files[0]);
            if (!imagePath) throw new Error('Chemin image manquant');
            hiddenImage.value = imagePath;
        } catch (err) {
            showNotification(err.message || 'Erreur lors de l\'upload de l\'image', 'error');
            return;
        }
    } else if (!currentActualiteId && !imagePath) {
        showNotification('Veuillez sélectionner une image.', 'error');
        return;
    }

    const actualite = {
        id: currentActualiteId ? parseInt(currentActualiteId) : null,
        titre: document.getElementById('actualiteTitre').value,
        description: document.getElementById('actualiteDescription').value,
        contenu: document.getElementById('actualiteContenu').value || null,
        image: imagePath,
        date_publication: document.getElementById('actualiteDate').value,
        categorie: document.getElementById('actualiteCategorie').value || null,
        auteur: document.getElementById('actualiteAuteur').value || 'Par le Club'
    };

    try {
        await API.saveActualite(actualite);
        bootstrap.Modal.getInstance(document.getElementById('actualiteModal')).hide();
        showNotification(currentActualiteId ? 'Actualité modifiée avec succès' : 'Actualité publiée avec succès');
        loadActualites();
        loadStats();
    } catch (error) {
        showNotification('Erreur lors de l\'enregistrement', 'error');
    }
}

async function deleteActualite(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
        try {
            await API.deleteActualite(id);
            showNotification('Actualité supprimée avec succès');
            loadActualites();
            loadStats();
        } catch (error) {
            showNotification('Erreur lors de la suppression', 'error');
        }
    }
}

function previewActualiteImage(url) {
    const container = document.getElementById('actualiteImagePreview');
    if (url) {
        const src = getImageUrl(url);
        container.innerHTML = `
            <label class="form-label">Aperçu</label><br>
            <img src="${src}" class="item-image-preview" alt="Preview" onerror="this.style.display='none'">
        `;
    } else {
        container.innerHTML = '';
    }
}

document.getElementById('actualiteImageFile').addEventListener('change', function() {
    const container = document.getElementById('actualiteImagePreview');
    if (this.files && this.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            container.innerHTML = '<label class="form-label">Aperçu</label><br><img src="' + e.target.result + '" class="item-image-preview" alt="Preview">';
        };
        reader.readAsDataURL(this.files[0]);
    } else {
        previewActualiteImage(document.getElementById('actualiteImage').value);
    }
});

