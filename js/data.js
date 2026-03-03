// Gestion des données avec localStorage

const DataManager = {
    // Initialiser les données si elles n'existent pas
    init: function() {
        if (!localStorage.getItem('rotaract_actions')) {
            localStorage.setItem('rotaract_actions', JSON.stringify([]));
        }
        if (!localStorage.getItem('rotaract_actualites')) {
            localStorage.setItem('rotaract_actualites', JSON.stringify([]));
        }
        if (!localStorage.getItem('rotaract_evenements')) {
            localStorage.setItem('rotaract_evenements', JSON.stringify([]));
        }
        if (!localStorage.getItem('rotaract_admin_password')) {
            // Mot de passe par défaut : admin123 (à changer en production)
            localStorage.setItem('rotaract_admin_password', btoa('admin123'));
        }
    },

    // Actions
    getActions: function() {
        const actions = localStorage.getItem('rotaract_actions');
        return actions ? JSON.parse(actions) : [];
    },

    saveAction: function(action) {
        const actions = this.getActions();
        if (action.id) {
            // Modifier une action existante
            const index = actions.findIndex(a => a.id === action.id);
            if (index !== -1) {
                actions[index] = action;
            }
        } else {
            // Ajouter une nouvelle action
            action.id = Date.now().toString();
            action.dateCreation = new Date().toISOString();
            actions.push(action);
        }
        localStorage.setItem('rotaract_actions', JSON.stringify(actions));
        return action;
    },

    deleteAction: function(id) {
        const actions = this.getActions();
        const filtered = actions.filter(a => a.id !== id);
        localStorage.setItem('rotaract_actions', JSON.stringify(filtered));
    },

    getAction: function(id) {
        const actions = this.getActions();
        return actions.find(a => a.id === id);
    },

    // Actualités
    getActualites: function() {
        const actualites = localStorage.getItem('rotaract_actualites');
        return actualites ? JSON.parse(actualites) : [];
    },

    saveActualite: function(actualite) {
        const actualites = this.getActualites();
        if (actualite.id) {
            // Modifier une actualité existante
            const index = actualites.findIndex(a => a.id === actualite.id);
            if (index !== -1) {
                actualites[index] = actualite;
            }
        } else {
            // Ajouter une nouvelle actualité
            actualite.id = Date.now().toString();
            actualite.dateCreation = new Date().toISOString();
            actualites.push(actualite);
        }
        localStorage.setItem('rotaract_actualites', JSON.stringify(actualites));
        return actualite;
    },

    deleteActualite: function(id) {
        const actualites = this.getActualites();
        const filtered = actualites.filter(a => a.id !== id);
        localStorage.setItem('rotaract_actualites', JSON.stringify(filtered));
    },

    getActualite: function(id) {
        const actualites = this.getActualites();
        return actualites.find(a => a.id === id);
    },

    // Événements
    getEvenements: function() {
        const evenements = localStorage.getItem('rotaract_evenements');
        return evenements ? JSON.parse(evenements) : [];
    },

    saveEvenement: function(evenement) {
        const evenements = this.getEvenements();
        if (evenement.id) {
            // Modifier un événement existant
            const index = evenements.findIndex(e => e.id === evenement.id);
            if (index !== -1) {
                evenements[index] = evenement;
            }
        } else {
            // Ajouter un nouvel événement
            evenement.id = Date.now().toString();
            evenement.dateCreation = new Date().toISOString();
            evenements.push(evenement);
        }
        localStorage.setItem('rotaract_evenements', JSON.stringify(evenements));
        return evenement;
    },

    deleteEvenement: function(id) {
        const evenements = this.getEvenements();
        const filtered = evenements.filter(e => e.id !== id);
        localStorage.setItem('rotaract_evenements', JSON.stringify(filtered));
    },

    getEvenement: function(id) {
        const evenements = this.getEvenements();
        return evenements.find(e => e.id === id);
    },

    // Authentification
    checkPassword: function(password) {
        const stored = localStorage.getItem('rotaract_admin_password');
        return btoa(password) === stored;
    },

    setPassword: function(newPassword) {
        localStorage.setItem('rotaract_admin_password', btoa(newPassword));
    }
};

// Initialiser au chargement
DataManager.init();

