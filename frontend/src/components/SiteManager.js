export class SiteManager {
    constructor() {
        this.sitesList = document.getElementById('sitesList');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addSiteForm').addEventListener('submit', this.handleAddSite.bind(this));
    }

    async handleAddSite(event) {
        event.preventDefault();
        const villeId = event.target.dataset.villeId;
        const formData = new FormData(event.target);
        const imageFile = formData.get('image');
        
        const imageUrl = await this.uploadImage(imageFile);
        if (!imageUrl) return;

        const newSite = {
            nom: formData.get('nom'),
            description: formData.get('description'),
            image: imageUrl,
            horaires: formData.get('horaires'),
            tarifs: formData.get('tarifs')
        };

        try {
            const response = await fetch(`/api/villes/${villeId}/sites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('adminToken')}`
                },
                body: JSON.stringify(newSite)
            });

            if (response.ok) {
                await window.app.villeManager.loadVilles();
                this.closeModal('addSiteModal');
                event.target.reset();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout du site:', error);
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

    openAddModal(villeId) {
        document.getElementById('addSiteForm').dataset.villeId = villeId;
        document.getElementById('addSiteModal').style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}
