// Configuration de l'API
const API_URL = 'http://localhost:3001/api';

// Gestionnaire de la page de contact
class ContactManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.mapContainer = document.getElementById('map');
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.initMap();
    }

    setupEventListeners() {
        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit(e);
        });
    }

    initMap() {
        // Coordonnées d'Abidjan
        const abidjan = { lat: 5.359952, lng: -4.008256 };
        
        // Création de la carte
        const map = new google.maps.Map(this.mapContainer, {
            center: abidjan,
            zoom: 15,
            styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#444444"}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [{"color": "#f2f2f2"}]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [{"saturation": -100}, {"lightness": 45}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [{"visibility": "simplified"}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [{"visibility": "off"}]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [{"color": "#46bcec"}, {"visibility": "on"}]
                }
            ]
        });

        // Ajout du marqueur
        const marker = new google.maps.Marker({
            position: abidjan,
            map: map,
            title: 'Tourisme CI'
        });

        // Ajout de la fenêtre d'info
        const infowindow = new google.maps.InfoWindow({
            content: `
                <div class="map-info">
                    <h3>Tourisme CI</h3>
                    <p>Abidjan, Plateau<br>01 BP 1234</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infowindow.open(map, marker);
        });
    }

    async handleContactSubmit(event) {
        const formData = new FormData(event.target);
        const data = {
            nom: formData.get('nom'),
            email: formData.get('email'),
            sujet: formData.get('sujet'),
            message: formData.get('message')
        };

        try {
            const response = await fetch(`${API_URL}/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                this.showNotification('success', 'Votre message a été envoyé avec succès !');
                event.target.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Erreur:', error);
            this.showNotification('error', 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.');
        }
    }

    showNotification(type, message) {
        // Créer l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Ajouter la notification au DOM
        document.body.appendChild(notification);

        // Supprimer la notification après 5 secondes
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    // Animation des questions fréquentes
    initFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('h3');
            const answer = item.querySelector('p');
            
            // Cacher initialement toutes les réponses
            answer.style.display = 'none';
            
            question.addEventListener('click', () => {
                // Toggle la réponse
                const isOpen = answer.style.display === 'block';
                
                // Fermer toutes les réponses
                faqItems.forEach(otherItem => {
                    const otherAnswer = otherItem.querySelector('p');
                    otherAnswer.style.display = 'none';
                    otherItem.classList.remove('active');
                });
                
                // Ouvrir/fermer la réponse cliquée
                if (!isOpen) {
                    answer.style.display = 'block';
                    item.classList.add('active');
                }
            });
        });
    }
}

// Initialisation
let contactManager;
document.addEventListener('DOMContentLoaded', () => {
    // Chargement asynchrone de l'API Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=VOTRE_CLE_API&callback=initContactManager`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
});

// Fonction de callback pour l'initialisation après le chargement de Google Maps
function initContactManager() {
    contactManager = new ContactManager();
    contactManager.initFAQ();
}
