// Configuration de l'API
const API_URL = 'http://localhost:3001/api';

// Gestionnaire de la page des actualités
class ActualitesManager {
    constructor() {
        this.featuredNews = document.querySelector('.featured-news');
        this.newsContainer = document.getElementById('actualitesContainer');
        this.searchInput = document.getElementById('searchActualite');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.newsletterForm = document.getElementById('newsletterForm');
        this.popularCities = document.getElementById('popularCities');
        this.popularSites = document.getElementById('popularSites');
        
        this.actualites = [];
        this.currentFilter = 'all';
        
        this.init();
        this.setupEventListeners();
    }

    async init() {
        await Promise.all([
            this.loadActualites(),
            this.loadPopularContent()
        ]);
        this.checkUrlParams();
    }

    setupEventListeners() {
        // Recherche
        this.searchInput.addEventListener('input', () => {
            this.filterActualites();
        });

        // Filtres
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.filterActualites();
            });
        });

        // Newsletter
        this.newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleNewsletterSubmit(e);
        });
    }

    async loadActualites() {
        try {
            const response = await fetch(`${API_URL}/actualites`);
            this.actualites = await response.json();
            
            // Afficher l'actualité à la une
            const featuredActu = this.actualites[0];
            this.featuredNews.innerHTML = `
                <div class="featured-card">
                    <div class="featured-image">
                        <img src="${featuredActu.image}" alt="${featuredActu.titre}">
                    </div>
                    <div class="featured-content">
                        <span class="featured-category">${featuredActu.categorie}</span>
                        <h2>${featuredActu.titre}</h2>
                        <p>${featuredActu.contenu.substring(0, 300)}...</p>
                        <div class="featured-meta">
                            <span class="date">${new Date(featuredActu.date).toLocaleDateString()}</span>
                            <a href="#" class="read-more" onclick="actualitesManager.showActualiteDetails(${featuredActu.id})">
                                Lire la suite
                            </a>
                        </div>
                    </div>
                </div>
            `;

            // Afficher les autres actualités
            this.displayActualites(this.actualites.slice(1));
        } catch (error) {
            console.error('Erreur lors du chargement des actualités:', error);
            this.newsContainer.innerHTML = '<p class="error-message">Impossible de charger les actualités pour le moment.</p>';
        }
    }

    displayActualites(actualites) {
        this.newsContainer.innerHTML = actualites.map(actu => `
            <div class="news-card" data-category="${actu.categorie}">
                <div class="news-image">
                    <img src="${actu.image}" alt="${actu.titre}">
                    <span class="category-tag">${actu.categorie}</span>
                </div>
                <div class="news-content">
                    <span class="news-date">${new Date(actu.date).toLocaleDateString()}</span>
                    <h3>${actu.titre}</h3>
                    <p>${actu.contenu.substring(0, 150)}...</p>
                    <div class="news-meta">
                        <span class="author">${actu.auteur || 'Admin'}</span>
                        <button class="btn-read" onclick="actualitesManager.showActualiteDetails(${actu.id})">
                            Lire la suite
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    filterActualites() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const filteredActus = this.actualites.slice(1).filter(actu => {
            const matchSearch = actu.titre.toLowerCase().includes(searchTerm) ||
                              actu.contenu.toLowerCase().includes(searchTerm);
            const matchFilter = this.currentFilter === 'all' || actu.categorie.toLowerCase() === this.currentFilter;
            return matchSearch && matchFilter;
        });
        this.displayActualites(filteredActus);
    }

    async showActualiteDetails(actualiteId) {
        try {
            const response = await fetch(`${API_URL}/actualites/${actualiteId}`);
            const actualite = await response.json();
            
            // Créer une modal pour afficher les détails
            const modal = document.createElement('div');
            modal.className = 'modal actualite-modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <button class="close-btn" onclick="this.closest('.modal').remove()">×</button>
                    <div class="actualite-details">
                        <div class="actualite-header">
                            <span class="category">${actualite.categorie}</span>
                            <h2>${actualite.titre}</h2>
                            <div class="meta">
                                <span class="date">${new Date(actualite.date).toLocaleDateString()}</span>
                                <span class="author">Par ${actualite.auteur || 'Admin'}</span>
                            </div>
                        </div>
                        
                        <div class="actualite-image">
                            <img src="${actualite.image}" alt="${actualite.titre}">
                        </div>
                        
                        <div class="actualite-body">
                            ${actualite.contenu}
                        </div>
                        
                        <div class="actualite-footer">
                            <div class="share-buttons">
                                <button onclick="actualitesManager.shareActualite('facebook', ${actualiteId})">
                                    Partager sur Facebook
                                </button>
                                <button onclick="actualitesManager.shareActualite('twitter', ${actualiteId})">
                                    Partager sur Twitter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
        } catch (error) {
            console.error('Erreur lors du chargement des détails de l\'actualité:', error);
        }
    }

    async loadPopularContent() {
        try {
            // Charger les villes populaires
            const villesResponse = await fetch(`${API_URL}/villes?popular=true`);
            const villes = await villesResponse.json();
            
            this.popularCities.innerHTML = villes.slice(0, 3).map(ville => `
                <div class="popular-item">
                    <img src="${ville.image}" alt="${ville.nom}">
                    <h4>${ville.nom}</h4>
                    <a href="/villes.html?id=${ville.id}">Découvrir</a>
                </div>
            `).join('');

            // Charger les sites populaires
            const sitesResponse = await fetch(`${API_URL}/sites?popular=true`);
            const sites = await sitesResponse.json();
            
            this.popularSites.innerHTML = sites.slice(0, 3).map(site => `
                <div class="popular-item">
                    <img src="${site.image}" alt="${site.nom}">
                    <h4>${site.nom}</h4>
                    <a href="/villes.html?site=${site.id}">Visiter</a>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erreur lors du chargement du contenu populaire:', error);
        }
    }

    async handleNewsletterSubmit(event) {
        const emailInput = event.target.querySelector('input[type="email"]');
        const email = emailInput.value;
        
        try {
            const response = await fetch(`${API_URL}/newsletter/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                alert('Merci de votre inscription à notre newsletter !');
                emailInput.value = '';
            } else {
                throw new Error('Erreur lors de l\'inscription');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Une erreur est survenue lors de l\'inscription. Veuillez réessayer.');
        }
    }

    shareActualite(platform, actualiteId) {
        const url = `${window.location.origin}/actualites.html?id=${actualiteId}`;
        let shareUrl;
        
        switch (platform) {
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }

    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const actualiteId = urlParams.get('id');
        
        if (actualiteId) {
            this.showActualiteDetails(actualiteId);
        }
    }
}

// Initialisation
let actualitesManager;
document.addEventListener('DOMContentLoaded', () => {
    actualitesManager = new ActualitesManager();
});
