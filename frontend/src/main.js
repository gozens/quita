import data from './data/villes.json';
import messages from './data/messages.json';
import AOS from 'aos';

// Initialiser AOS pour les animations
AOS.init({
    duration: 800,
    once: true
});

// Fonction pour créer une carte de ville
function createVilleCard(ville) {
    return `
        <div class="ville-card" data-aos="fade-up">
            <img src="${ville.image}" alt="${ville.nom}">
            <div class="ville-content">
                <h2>${ville.nom}</h2>
                <p>${ville.description}</p>
                <a href="/ville.html?id=${ville.nom.toLowerCase()}" class="btn">Découvrir</a>
            </div>
        </div>
    `;
}

// Fonction pour afficher toutes les villes
function displayVilles() {
    const villesContainer = document.querySelector('.villes-grid');
    if (!villesContainer) return;

    Object.values(data).forEach(ville => {
        villesContainer.innerHTML += createVilleCard(ville);
    });
}

// Fonction pour afficher les détails d'une ville
function displayVilleDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const villeId = urlParams.get('id');

    if (!villeId || !data[villeId]) return;

    const ville = data[villeId];
    const detailsContainer = document.querySelector('.ville-details');
    if (!detailsContainer) return;

    detailsContainer.innerHTML = `
        <h1>${ville.nom}</h1>
        <div class="histoire" data-aos="fade-up">
            <h2>Histoire</h2>
            <p><strong>Fondée en ${ville.histoire.creation}</strong></p>
            <p>${ville.histoire.contenu}</p>
        </div>

        <div class="actualites" data-aos="fade-up">
            <h2>Actualités</h2>
            ${ville.actualites.map(actu => `
                <div class="actualite-card">
                    <img src="${actu.image}" alt="${actu.titre}">
                    <h3>${actu.titre}</h3>
                    <p class="date">${new Date(actu.date).toLocaleDateString()}</p>
                    <p>${actu.contenu}</p>
                </div>
            `).join('')}
        </div>

        <h2>Sites touristiques</h2>
        <div class="sites-grid">
            ${ville.sites.map(site => `
                <div class="site-card" data-aos="fade-up">
                    <img src="${site.image}" alt="${site.nom}">
                    <h3>${site.nom}</h3>
                    <p>${site.description}</p>
                    <div class="site-info">
                        <p><strong>Horaires:</strong> ${site.horaires}</p>
                        <p><strong>Tarifs:</strong> ${site.tarifs}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Gestion du formulaire de contact
function handleContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const messageData = {
            ...Object.fromEntries(formData),
            date: new Date().toISOString()
        };
        
        // Ajouter le message à la liste
        messages.messages.push(messageData);
        
        // Ici vous pouvez ajouter la logique pour sauvegarder dans un vrai backend
        console.log('Message enregistré:', messageData);
        alert('Message envoyé avec succès!');
        form.reset();
    });
}

// Initialiser la page
if (window.location.pathname === '/ville.html') {
    displayVilleDetails();
} else {
    displayVilles();
    handleContactForm();
}