// Script pour afficher dynamiquement les actions et actualités sur les pages publiques

// Construire l'URL d'une image (uploads/... ou images/...) depuis la racine du site
function getImageUrl(path) {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('//')) return path;
    const base = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
    return base + path;
}

// Charger et afficher les actions (sur l'index : data-limit="3" pour n'afficher que les 3 plus récentes)
async function loadActions() {
    const container = document.getElementById('actions-container');
    if (!container) return;

    const limit = container.dataset.limit ? parseInt(container.dataset.limit, 10) : null;
    const url = limit ? `api/public.php?type=actions&limit=${limit}` : 'api/public.php?type=actions';

    try {
        const response = await fetch(url);
        const actions = await response.json();
        
        if (!actions || actions.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">Aucune action disponible pour le moment.</p>';
            return;
        }

        // Trier par date (plus récentes en premier) au cas où l'API ne le fait pas
        const sortedActions = actions.sort((a, b) => new Date(b.date_activite) - new Date(a.date_activite));

        container.innerHTML = sortedActions.map(action => {
            const montantCollecte = parseFloat(action.montant_collecte) || 0;
            const montantObjectif = parseFloat(action.montant_objectif) || 0;
            const progress = montantObjectif > 0 
                ? Math.min(100, Math.round((montantCollecte / montantObjectif) * 100))
                : 0;
            
            return `
                <div class="col-lg-4 col-md-6 col-12 mb-4 mb-lg-0">
                    <div class="custom-block-wrap">
                        <img src="${getImageUrl(action.image || 'images/action.webp')}" class="custom-block-image img-fluid" alt="${action.titre}" onerror="this.onerror=null;this.src=getImageUrl('images/action.webp')">
                        <div class="custom-block">
                            <div class="custom-block-body">
                                <h5 class="mb-3">${action.titre}</h5>
                                <p>${action.description}</p>
                                ${montantObjectif > 0 ? `
                                    <div class="progress mt-4">
                                        <div class="progress-bar" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" style="width: ${progress}%"></div>
                                    </div>
                                    <div class="d-flex align-items-center my-2">
                                        <p class="mb-0">
                                            <strong>Collecté :</strong>
                                            ${montantCollecte.toLocaleString()} FCFA
                                        </p>
                                        <p class="ms-auto mb-0">
                                            <strong>Objectif :</strong>
                                            ${montantObjectif.toLocaleString()} FCFA
                                        </p>
                                    </div>
                                ` : ''}
                                <p class="text-muted mt-2"><small><i class="bi-calendar me-1"></i>${formatDate(action.date_activite)}</small></p>
                            </div>
                            <a href="contact.html" class="custom-btn btn">Nous contacter</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erreur lors du chargement des actions:', error);
        container.innerHTML = '<p class="text-center text-muted">Erreur lors du chargement des actions.</p>';
    }
}

// Catégories officielles des actualités (alignées avec le select en admin)
var ACTUALITES_CATEGORIES = ['Santé', 'Action', 'Éducation', 'Environnement', 'Solidarité', 'Évènement', 'Formation', 'Réunion', 'Anniversaire'];

// Données actualités pour la page actualites.html (filtre recherche + catégorie)
var allActualitesData = [];
var actualitesFilterCategorie = '';
var actualitesFilterSearch = '';

function renderOneActualiteBlock(actualite) {
    const categories = actualite.categorie ? [actualite.categorie] : [];
    const imgPath = actualite.image || actualite.IMAGE || 'images/action.webp';
    return `
        <div class="news-block">
            <div class="news-block-top">
                <a href="actualites.html">
                    <img src="${getImageUrl(imgPath)}" class="news-image img-fluid" alt="${actualite.titre}" onerror="this.onerror=null;this.src=getImageUrl('images/action.webp')">
                </a>
                ${actualite.categorie ? `
                    <div class="news-category-block">
                        <span class="category-block-link">${actualite.categorie}</span>
                    </div>
                ` : ''}
            </div>
            <div class="news-block-info">
                <div class="d-flex mt-2">
                    <div class="news-block-date">
                        <p>
                            <i class="bi-calendar4 custom-icon me-1"></i>
                            ${formatDate(actualite.date_publication)}
                        </p>
                    </div>
                    ${actualite.auteur ? `
                        <div class="news-block-author mx-5">
                            <p>
                                <i class="bi-person custom-icon me-1"></i>
                                ${actualite.auteur}
                            </p>
                        </div>
                    ` : ''}
                </div>
                <div class="news-block-title mb-2">
                    <h4><a href="actualites.html" class="news-block-title-link">${actualite.titre}</a></h4>
                </div>
                <div class="news-block-body">
                    <p>${actualite.description}</p>
                </div>
            </div>
        </div>
    `;
}

function renderActualitesList(actualites) {
    const container = document.getElementById('actualites-container');
    if (!container) return;
    if (!actualites || actualites.length === 0) {
        container.innerHTML = '<p class="text-center text-muted">Aucune actualité ne correspond à votre recherche.</p>';
        return;
    }
    container.innerHTML = actualites.map(renderOneActualiteBlock).join('');
}

function applyActualitesFilters() {
    let list = allActualitesData.slice();
    if (actualitesFilterCategorie) {
        list = list.filter(a => (a.categorie || '').trim() === actualitesFilterCategorie);
    }
    if (actualitesFilterSearch) {
        const q = actualitesFilterSearch.toLowerCase().trim();
        list = list.filter(a =>
            (a.titre || '').toLowerCase().includes(q) ||
            (a.description || '').toLowerCase().includes(q) ||
            ((a.contenu || '').toLowerCase().includes(q))
        );
    }
    renderActualitesList(list);
}

// Charger et afficher les actualités (page actualites.html : filtre recherche, récentes, catégories)
async function loadActualites() {
    const container = document.getElementById('actualites-container');
    if (!container) return;

    try {
        const response = await fetch('api/public.php?type=actualites');
        const actualites = await response.json();
        
        if (!actualites || actualites.length === 0) {
            container.innerHTML = '<p class="text-center text-muted">Aucune actualité disponible pour le moment.</p>';
            var sidebar = document.getElementById('actualites-recent-sidebar');
            if (sidebar) sidebar.innerHTML = '<p class="text-muted small">Aucune actualité récente.</p>';
            var catContainer = document.getElementById('actualites-categories');
            if (catContainer) catContainer.innerHTML = '';
            return;
        }

        var sorted = actualites.sort((a, b) => new Date(b.date_publication) - new Date(a.date_publication));
        allActualitesData = sorted;

        // Liste principale
        actualitesFilterCategorie = '';
        actualitesFilterSearch = '';
        renderActualitesList(sorted);

        // Sidebar "Actualités récentes" (5 dernières)
        var recentContainer = document.getElementById('actualites-recent-sidebar');
        if (recentContainer) {
            var recent = sorted.slice(0, 5);
            recentContainer.innerHTML = recent.map(function(a) {
                var imgPath = a.image || a.IMAGE || 'images/action.webp';
                return `
                    <div class="news-block news-block-two-col d-flex mt-4">
                        <div class="news-block-two-col-image-wrap">
                            <a href="actualites.html">
                                <img src="${getImageUrl(imgPath)}" class="news-image img-fluid" alt="${a.titre}" onerror="this.src=getImageUrl('images/action.webp')">
                            </a>
                        </div>
                        <div class="news-block-two-col-info">
                            <div class="news-block-title mb-2">
                                <h6><a href="actualites.html" class="news-block-title-link">${a.titre}</a></h6>
                            </div>
                            <div class="news-block-date">
                                <p><i class="bi-calendar4 custom-icon me-1"></i>${formatDate(a.date_publication)}</p>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Catégories avec effectifs (issues des actualités)
        var catContainer = document.getElementById('actualites-categories');
        if (catContainer) {
            var counts = {};
            ACTUALITES_CATEGORIES.forEach(function(c) { counts[c] = 0; });
            sorted.forEach(function(a) {
                var c = (a.categorie || '').trim();
                if (c && counts.hasOwnProperty(c)) counts[c]++;
            });
            catContainer.innerHTML =
                '<a href="#" class="category-block-link actualites-cat-link" data-cat="">Toutes <span class="badge">' + sorted.length + '</span></a>' +
                ACTUALITES_CATEGORIES.map(function(c) {
                    return '<a href="#" class="category-block-link actualites-cat-link" data-cat="' + c + '">' + c + ' <span class="badge">' + (counts[c] || 0) + '</span></a>';
                }).join('');
            catContainer.querySelectorAll('.actualites-cat-link').forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    actualitesFilterCategorie = this.getAttribute('data-cat') || '';
                    applyActualitesFilters();
                });
            });
        }

        // Recherche
        var searchForm = document.getElementById('actualites-search-form');
        var searchInput = document.getElementById('actualites-search');
        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                actualitesFilterSearch = searchInput.value;
                applyActualitesFilters();
            });
            searchInput.addEventListener('input', function() {
                actualitesFilterSearch = this.value;
                applyActualitesFilters();
            });
        }
    } catch (error) {
        console.error('Erreur lors du chargement des actualités:', error);
        container.innerHTML = '<p class="text-center text-muted">Erreur lors du chargement des actualités.</p>';
    }
}

// Charger les actualités récentes pour la page d'accueil (3 dernières)
async function loadRecentActualites() {
    const container = document.getElementById('recent-actualites-container');
    if (!container) return;

    try {
        const response = await fetch('api/public.php?type=actualites&limit=3');
        const actualites = await response.json();
        
        if (!actualites || actualites.length === 0) {
            container.innerHTML = '<p class="text-center text-muted col-12">Aucune actualité disponible pour le moment.</p>';
            return;
        }

        container.innerHTML = actualites.map(actualite => {
            const imgPath = actualite.image || actualite.IMAGE || 'images/action.webp';
            const excerpt = actualite.description.length > 120 ? actualite.description.substring(0, 120).trim() + '…' : actualite.description;
            return `
            <div class="col-lg-4 col-md-6 col-12">
                <article class="actualites-home-card">
                    <a href="actualites.html" class="actualites-home-card__link">
                        <div class="actualites-home-card__image-wrap">
                            <img src="${getImageUrl(imgPath)}" alt="${actualite.titre}" onerror="this.onerror=null;this.src=getImageUrl('images/action.webp')">
                        </div>
                        <div class="actualites-home-card__body">
                            <span class="actualites-home-card__date">
                                <i class="bi-calendar4" aria-hidden="true"></i>
                                ${formatDate(actualite.date_publication)}
                            </span>
                            <h3 class="actualites-home-card__title">${actualite.titre}</h3>
                            <p class="actualites-home-card__excerpt">${excerpt}</p>
                            <span class="actualites-home-card__more">Lire la suite <i class="bi-arrow-right"></i></span>
                        </div>
                    </a>
                </article>
            </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Erreur lors du chargement des actualités récentes:', error);
    }
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    loadActions();
    loadActualites();
    loadRecentActualites();
});

