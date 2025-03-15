export class VilleManager {
    constructor() {
        this.villesList = document.getElementById('villesList');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addVilleForm').addEventListener('submit', this.handleAddVille.bind(this));
    }

    async handleAddVille(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const imageFile = formData.get('image');
        
        const imageUrl = await this.uploadImage(imageFile);
        if (!imageUrl) return;

        const newVille = {
            nom: formData.get('nom'),
            description: formData.get('description'),
            image: imageUrl,
            histoire: {
                creation: formData.get('creation'),
                contenu: formData.get('histoire')
            },
            actualites: [],
            sites: []
        };

        try {
            const response = await fetch('/api/villes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('adminToken')}`
                },
                body: JSON.stringify(newVille)
            });

            if (response.ok) {
                await this.loadVilles();
                this.closeModal('addVilleModal');
                event.target.reset();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout:', error);
        }
    }

    async uploadImage(file) {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            return data.imageUrl;
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            return null;
        }
    }

    async loadVilles() {
        try {
            const response = await fetch('/api/villes');
            const data = await response.json();
            this.displayVilles(data);
        } catch (error) {
            console.error('Erreur lors du chargement des villes:', error);
        }
    }

    displayVilles(villes) {
        this.villesList.innerHTML = '';

        Object.entries(villes).forEach(([id, ville]) => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <div class="item-header">
                    <img src="${ville.image}" alt="${ville.nom}" class="item-image">
                    <h3>${ville.nom}</h3>
                </div>
                <p>${ville.description}</p>
                <div class="item-details">
                    <h4>Histoire</h4>
                    <p>Création: ${ville.histoire.creation}</p>
                    <p>${ville.histoire.contenu}</p>
                    
                    <h4>Sites Touristiques (${ville.sites.length})</h4>
                    <div class="sites-list">
                        ${ville.sites.map(site => `
                            <div class="site-item">
                                <img src="${site.image}" alt="${site.nom}">
                                <h5>${site.nom}</h5>
                            </div>
                        `).join('')}
                    </div>

                    <h4>Actualités (${ville.actualites.length})</h4>
                    <div class="actualites-list">
                        ${ville.actualites.map(actu => `
                            <div class="actu-item">
                                <h5>${actu.titre}</h5>
                                <p>${actu.date}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="item-actions">
                    <button class="btn" onclick="window.app.siteManager.openAddModal('${id}')">Ajouter un site</button>
                    <button class="btn" onclick="window.app.actuManager.openAddModal('${id}')">Ajouter une actualité</button>
                    <button class="delete-btn" onclick="window.app.villeManager.deleteVille('${id}')">Supprimer</button>
                </div>
            `;
            this.villesList.appendChild(card);
        });
    }

    async deleteVille(villeId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette ville ?')) return;

        try {
            const response = await fetch(`/api/villes/${villeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${Cookies.get('adminToken')}`
                }
            });

            if (response.ok) {
                await this.loadVilles();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}
