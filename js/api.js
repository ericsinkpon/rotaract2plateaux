// Gestion des appels API

const API = {
    baseUrl: '', // URL de base pour les API (vide car même domaine)
    
    // Actions
    getActions: async function() {
        const response = await fetch('api/actions.php');
        return await response.json();
    },
    
    getAction: async function(id) {
        const response = await fetch(`api/actions.php?id=${id}`);
        return await response.json();
    },
    
    saveAction: async function(action) {
        const method = action.id ? 'PUT' : 'POST';
        const response = await fetch('api/actions.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action)
        });
        return await response.json();
    },
    
    deleteAction: async function(id) {
        const response = await fetch(`api/actions.php?id=${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },
    
    // Actualités
    getActualites: async function() {
        const response = await fetch('api/actualites.php');
        return await response.json();
    },
    
    getActualite: async function(id) {
        const response = await fetch(`api/actualites.php?id=${id}`);
        return await response.json();
    },
    
    saveActualite: async function(actualite) {
        const method = actualite.id ? 'PUT' : 'POST';
        const response = await fetch('api/actualites.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actualite)
        });
        return await response.json();
    },
    
    deleteActualite: async function(id) {
        const response = await fetch(`api/actualites.php?id=${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },
    
    // Événements
    getEvenements: async function() {
        const response = await fetch('api/evenements.php');
        return await response.json();
    },
    
    getEvenement: async function(id) {
        const response = await fetch(`api/evenements.php?id=${id}`);
        return await response.json();
    },
    
    saveEvenement: async function(evenement) {
        const method = evenement.id ? 'PUT' : 'POST';
        const response = await fetch('api/evenements.php', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(evenement)
        });
        return await response.json();
    },
    
    deleteEvenement: async function(id) {
        const response = await fetch(`api/evenements.php?id=${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    },
    
    // Authentification
    login: async function(username, password) {
        const response = await fetch('api/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        return await response.json();
    },
    
    checkAuth: async function() {
        const response = await fetch('api/auth.php');
        return await response.json();
    },
    
    logout: async function() {
        const response = await fetch('api/auth.php', {
            method: 'DELETE'
        });
        return await response.json();
    },

    // Upload d'image (retourne le chemin relatif)
    uploadImage: async function(file) {
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('api/upload.php', {
            method: 'POST',
            body: formData
        });
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error('Réponse d\'upload invalide');
        }
        if (data.error) throw new Error(data.error);
        if (!data.path || typeof data.path !== 'string') throw new Error('Chemin image manquant dans la réponse');
        return data.path.trim();
    }
};

