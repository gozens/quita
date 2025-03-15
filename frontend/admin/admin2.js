// Configuration de l'API
const API_URL = 'http://localhost:3001/api';

// Gestionnaire de l'interface d'administration
class AdminManager {
    constructor() {
        this.currentSection = 'dashboard';
        this.init();
        this.setupEventListeners();
    }

    init() {
        // Vérifier l'authentification
        this.checkAuth();
        
        // Charger la section active
        const section = new URLSearchParams(window.location.search).get('section') || 'dashboard';
        this.loadSection(section);
    }

    setupEventListeners() {
        // Gestion du menu
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.dataset.section;
                this.loadSection(section);
            });
        });

        // Gestion de la déconnexion
        document.getElementById('logout').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });
    }

    async checkAuth() {
        try {
            const response = await fetch(`${API_URL}/auth/check`, {
                credentials: 'include'
            });
            
            console.log(await response.json())
            if (!response.ok) {
                // window.location.href = '/login.html';
            }
        } catch (error) {
            console.error('Erreur de vérification d\'authentification:', error);
            // window.location.href = '/login.html';
        }
    }

    async loadSection(section) {
        // Mettre à jour l'URL
        history.pushState(null, '', `?section=${section}`);
        
        // Mettre à jour le menu
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) {
                link.classList.add('active');
            }
        });

        // Charger le contenu de la section
        const contentArea = document.getElementById('content-area');
        
        try {
            switch (section) {
                case 'dashboard':
                    await this.loadDashboard(contentArea);
                    break;
                case 'villes':
                    await this.loadVilles(contentArea);
                    break;
                case 'sites':
                    await this.loadSites(contentArea);
                    break;
                case 'actualites':
                    await this.loadActualites(contentArea);
                    break;
                case 'mediatheque':
                    await this.loadMediatheque(contentArea);
                    break;
            }
        } catch (error) {
            console.error(`Erreur lors du chargement de la section ${section}:`, error);
            contentArea.innerHTML = `
                <div class="error-message">
                    Une erreur est survenue lors du chargement de la section.
                    <button onclick="adminManager.loadSection('${section}')">Réessayer</button>
                </div>
            `;
        }
    }

    async loadDashboard(container) {
        try {
            const [villesCount, sitesCount, actualitesCount, messagesCount] = await Promise.all([
                fetch(`${API_URL}/villes/count`).then(r => r.json()),
                fetch(`${API_URL}/sites/count`).then(r => r.json()),
                fetch(`${API_URL}/actualites/count`).then(r => r.json()),
                fetch(`${API_URL}/messages/count`).then(r => r.json())
            ]);

            container.innerHTML = `
                <div class="dashboard-header">
                    <h2>Tableau de bord</h2>
                    <p>Bienvenue dans l'interface d'administration</p>
                </div>

                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Villes</h3>
                        <p class="stat-number">${villesCount}</p>
                        <a href="#" onclick="adminManager.loadSection('villes')">Gérer les villes</a>
                    </div>
                    <div class="stat-card">
                        <h3>Sites Touristiques</h3>
                        <p class="stat-number">${sitesCount}</p>
                        <a href="#" onclick="adminManager.loadSection('sites')">Gérer les sites</a>
                    </div>
                    <div class="stat-card">
                        <h3>Actualités</h3>
                        <p class="stat-number">${actualitesCount}</p>
                        <a href="#" onclick="adminManager.loadSection('actualites')">Gérer les actualités</a>
                    </div>
                    <div class="stat-card">
                        <h3>Messages</h3>
                        <p class="stat-number">${messagesCount}</p>
                        <a href="/messages.html">Voir les messages</a>
                    </div>
                </div>

                <div class="recent-activity">
                    <h3>Activités Récentes</h3>
                    <div id="activity-feed" class="activity-feed">
                        <!-- Les activités seront chargées ici -->
                    </div>
                </div>
            `;

            // Charger les activités récentes
            this.loadRecentActivities();
        } catch (error) {
            console.error('Erreur lors du chargement du tableau de bord:', error);
            throw error;
        }
    }

    async loadVilles(container) {
        try {
            const response = await fetch(`${API_URL}/villes`);
            const villes = await response.json();

            container.innerHTML = `
                <div class="section-header">
                    <h2>Gestion des Villes</h2>
                    <button class="btn-add" onclick="adminManager.showVilleForm()">
                        Ajouter une ville
                    </button>
                </div>

                <div class="data-grid">
                    ${villes.map(ville => `
                        <div class="data-card">
                            <div class="card-image">
                                <img src="${ville.image}" alt="${ville.nom}">
                            </div>
                            <div class="card-content">
                                <h3>${ville.nom}</h3>
                                <p>${ville.description.substring(0, 100)}...</p>
                                <div class="card-actions">
                                    <button onclick="adminManager.editVille(${ville.id})">Modifier</button>
                                    <button onclick="adminManager.deleteVille(${ville.id})" class="btn-danger">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Erreur lors du chargement des villes:', error);
            throw error;
        }
    }

    async loadSites(container) {
        try {
            const response = await fetch(`${API_URL}/sites`);
            const sites = await response.json();

            container.innerHTML = `
                <div class="section-header">
                    <h2>Gestion des Sites Touristiques</h2>
                    <button class="btn-add" onclick="adminManager.showSiteForm()">
                        Ajouter un site
                    </button>
                </div>

                <div class="data-grid">
                    ${sites.map(site => `
                        <div class="data-card">
                            <div class="card-image">
                                <img src="${site.image}" alt="${site.nom}">
                            </div>
                            <div class="card-content">
                                <h3>${site.nom}</h3>
                                <p>${site.description.substring(0, 100)}...</p>
                                <div class="site-info">
                                    <span>📍 ${site.ville}</span>
                                    <span>⏰ ${site.horaires}</span>
                                </div>
                                <div class="card-actions">
                                    <button onclick="adminManager.editSite(${site.id})">Modifier</button>
                                    <button onclick="adminManager.deleteSite(${site.id})" class="btn-danger">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Erreur lors du chargement des sites:', error);
            throw error;
        }
    }

    async loadActualites(container) {
        try {
            const response = await fetch(`${API_URL}/actualites`);
            const actualites = await response.json();

            container.innerHTML = `
                <div class="section-header">
                    <h2>Gestion des Actualités</h2>
                    <button class="btn-add" onclick="adminManager.showActualiteForm()">
                        Ajouter une actualité
                    </button>
                </div>

                <div class="data-grid">
                    ${actualites.map(actu => `
                        <div class="data-card">
                            <div class="card-image">
                                <img src="${actu.image}" alt="${actu.titre}">
                                <span class="category-tag">${actu.categorie}</span>
                            </div>
                            <div class="card-content">
                                <h3>${actu.titre}</h3>
                                <span class="date">${new Date(actu.date).toLocaleDateString()}</span>
                                <p>${actu.contenu.substring(0, 100)}...</p>
                                <div class="card-actions">
                                    <button onclick="adminManager.editActualite(${actu.id})">Modifier</button>
                                    <button onclick="adminManager.deleteActualite(${actu.id})" class="btn-danger">
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('Erreur lors du chargement des actualités:', error);
            throw error;
        }
    }

    async loadMediatheque(container) {
        try {
            const response = await fetch(`${API_URL}/media`);
            const media = await response.json();

            container.innerHTML = `
                <div class="section-header">
                    <h2>Médiathèque</h2>
                    <div class="upload-zone">
                        <input type="file" id="mediaUpload" multiple accept="image/*" style="display: none;">
                        <button class="btn-upload" onclick="document.getElementById('mediaUpload').click()">
                            Téléverser des médias
                        </button>
                    </div>
                </div>

                <div class="media-grid">
                    ${media.map(item => `
                        <div class="media-card" data-id="${item.id}">
                            <div class="media-preview">
                                <img src="${item.url}" alt="${item.nom}">
                            </div>
                            <div class="media-info">
                                <p>${item.nom}</p>
                                <span>${this.formatFileSize(item.taille)}</span>
                            </div>
                            <div class="media-actions">
                                <button onclick="adminManager.copyMediaUrl('${item.url}')">Copier le lien</button>
                                <button onclick="adminManager.deleteMedia(${item.id})" class="btn-danger">
                                    Supprimer
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;

            // Configuration de l'upload de fichiers
            this.setupMediaUpload();
        } catch (error) {
            console.error('Erreur lors du chargement de la médiathèque:', error);
            throw error;
        }
    }

    async loadRecentActivities() {
        try {
            const response = await fetch(`${API_URL}/activities`);
            const activities = await response.json();

            const activityFeed = document.getElementById('activity-feed');
            activityFeed.innerHTML = activities.map(activity => `
                <div class="activity-item">
                    <span class="activity-time">${this.formatActivityTime(activity.date)}</span>
                    <span class="activity-text">${activity.description}</span>
                </div>
            `).join('');
        } catch (error) {
            console.error('Erreur lors du chargement des activités:', error);
        }
    }

    // Méthodes utilitaires
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    formatActivityTime(date) {
        const now = new Date();
        const activityDate = new Date(date);
        const diff = now - activityDate;
        
        if (diff < 60000) return 'À l\'instant';
        if (diff < 3600000) return `Il y a ${Math.floor(diff/60000)} minutes`;
        if (diff < 86400000) return `Il y a ${Math.floor(diff/3600000)} heures`;
        return activityDate.toLocaleDateString();
    }

    // Méthodes de gestion des formulaires
    showVilleForm(villeId = null) {
        // TODO: Implémenter le formulaire d'ajout/modification de ville
    }

    showSiteForm(siteId = null) {
        // TODO: Implémenter le formulaire d'ajout/modification de site
    }

    showActualiteForm(actualiteId = null) {
        // TODO: Implémenter le formulaire d'ajout/modification d'actualité
    }

    // Méthodes de gestion des médias
    setupMediaUpload() {
        const input = document.getElementById('mediaUpload');
        input.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            
            for (const file of files) {
                const formData = new FormData();
                formData.append('media', file);
                
                try {
                    const response = await fetch(`${API_URL}/media/upload`, {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        this.loadMediatheque(document.getElementById('content-area'));
                    } else {
                        throw new Error('Erreur lors du téléversement');
                    }
                } catch (error) {
                    console.error('Erreur lors du téléversement:', error);
                    alert('Une erreur est survenue lors du téléversement du fichier.');
                }
            }
        });
    }

    copyMediaUrl(url) {
        navigator.clipboard.writeText(url)
            .then(() => alert('URL copiée dans le presse-papier !'))
            .catch(err => console.error('Erreur lors de la copie:', err));
    }

    // Méthodes de gestion de session
    async handleLogout() {
        try {
            await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include'
            });
            window.location.href = '/login.html';
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error);
        }
    }
}

// Initialisation
let adminManager;
document.addEventListener('DOMContentLoaded', () => {
    adminManager = new AdminManager();
});
