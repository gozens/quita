export class HomeManager {
    constructor() {
        this.villesGrid = document.getElementById('villesGrid');
        this.sitesGrid = document.getElementById('sitesGrid');
        this.actualitesGrid = document.getElementById('actualitesGrid');
        this.loadData();
    }

    async loadData() {
        try {
            const response = await fetch('/api/villes');
            const villes = await response.json();
            this.displayVilles(villes);
            this.displaySites(villes);
            this.displayActualites(villes);
        } catch (error) {
            console.error('Erreur lors du chargement des données:', error);
            this.showError('Une erreur est survenue lors du chargement des données');
        }
    }

    displayVilles(villes) {
        if (!this.villesGrid) return;
        
        Object.values(villes).forEach(ville => {
            const card = this.createCard({
                title: ville.nom,
                description: ville.description,
                image: ville.image,
                link: `#ville-${ville.id}`,
                type: 'ville'
            });
            this.villesGrid.appendChild(card);
        });
    }

    displaySites(villes) {
        if (!this.sitesGrid) return;

        Object.values(villes).forEach(ville => {
            if (ville.sites) {
                ville.sites.forEach(site => {
                    const card = this.createCard({
                        title: site.nom,
                        description: site.description,
                        image: site.image,
                        extraInfo: `Horaires : ${site.horaires} | Tarifs : ${site.tarifs}`,
                        type: 'site'
                    });
                    this.sitesGrid.appendChild(card);
                });
            }
        });
    }

    displayActualites(villes) {
        if (!this.actualitesGrid) return;

        const actualites = [];
        Object.values(villes).forEach(ville => {
            if (ville.actualites) {
                ville.actualites.forEach(actu => {
                    actualites.push({
                        ...actu,
                        ville: ville.nom
                    });
                });
            }
        });

        // Trier les actualités par date
        actualites.sort((a, b) => new Date(b.date) - new Date(a.date));

        actualites.forEach(actu => {
            const card = this.createCard({
                title: actu.titre,
                description: actu.contenu,
                image: actu.image,
                extraInfo: `${new Date(actu.date).toLocaleDateString('fr-FR')} - ${actu.ville}`,
                type: 'actualite'
            });
            this.actualitesGrid.appendChild(card);
        });
    }

    createCard({ title, description, image, link, extraInfo, type }) {
        const card = document.createElement('div');
        card.className = 'card fade-in';

        const imageElem = document.createElement('img');
        imageElem.src = image;
        imageElem.alt = title;
        card.appendChild(imageElem);

        const content = document.createElement('div');
        content.className = 'card-content';

        const titleElem = document.createElement('h3');
        if (link) {
            const titleLink = document.createElement('a');
            titleLink.href = link;
            titleLink.textContent = title;
            titleElem.appendChild(titleLink);
        } else {
            titleElem.textContent = title;
        }
        content.appendChild(titleElem);

        const descElem = document.createElement('p');
        descElem.textContent = description;
        content.appendChild(descElem);

        if (extraInfo) {
            const infoElem = document.createElement('p');
            infoElem.className = 'card-info';
            infoElem.textContent = extraInfo;
            content.appendChild(infoElem);
        }

        card.appendChild(content);
        return card;
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        [this.villesGrid, this.sitesGrid, this.actualitesGrid].forEach(grid => {
            if (grid) {
                grid.innerHTML = '';
                grid.appendChild(errorDiv.cloneNode(true));
            }
        });
    }
}
