export class ActualiteManager {
    constructor() {
        this.actualitesList = document.getElementById('actualitesList');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('addActuForm').addEventListener('submit', this.handleAddActualite.bind(this));
    }

    async handleAddActualite(event) {
        event.preventDefault();
        const villeId = event.target.dataset.villeId;
        const formData = new FormData(event.target);
        const imageFile = formData.get('image');
        
        const imageUrl = await this.uploadImage(imageFile);
        if (!imageUrl) return;

        const newActu = {
            titre: formData.get('titre'),
            date: formData.get('date'),
            contenu: formData.get('contenu'),
            image: imageUrl
        };

        try {
            const response = await fetch(`/api/villes/${villeId}/actualites`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${Cookies.get('adminToken')}`
                },
                body: JSON.stringify(newActu)
            });

            if (response.ok) {
                await window.app.villeManager.loadVilles();
                this.closeModal('addActuModal');
                event.target.reset();
            }
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'actualité:', error);
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
        document.getElementById('addActuForm').dataset.villeId = villeId;
        document.getElementById('addActuModal').style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
}
