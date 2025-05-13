// Configuration de l'API
const API_URL = "http://localhost:3001/api";
const staticImage = "http://localhost:3001";

// Gestionnaire de la page des villes
class VillesManager {
  constructor() {
    this.villesContainer = document.getElementById("villesContainer");
    this.villeDetails = document.getElementById("villeDetails");
    this.searchInput = document.getElementById("searchVille");
    this.filterButtons = document.querySelectorAll(".filter-btn");

    this.villes = [];
    this.currentFilter = "all";

    this.init();
    this.setupEventListeners();
  }

  async init() {
    await this.loadVilles();
    this.checkUrlParams();
  }

  setupEventListeners() {
    // Recherche
    this.searchInput.addEventListener("input", () => {
      this.filterVilles();
    });

    // Filtres
    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.currentFilter = btn.dataset.filter;
        this.filterVilles();
      });
    });
  }

  async loadVilles() {
    try {
      const response = await fetch(`${API_URL}/villes`);
      this.villes = await response.json();
      this.displayVilles(this.villes);
    } catch (error) {
      console.error("Erreur lors du chargement des villes:", error);
      this.villesContainer.innerHTML =
        '<p class="error-message">Impossible de charger les villes pour le moment.</p>';
    }
  }

  displayVilles(villes) {
    this.villesContainer.innerHTML = villes
      .map(
        (ville) => `
            <div class="ville-card" data-id="${ville.id}" data-region="${
          ville.region
        }">
                <div class="ville-image">
                    <img src="${staticImage}${ville.image}" alt="${ville.nom}">
                </div>
                <div class="ville-content">
                    <h3>${ville.nom}</h3>
                    <p>${ville.description.substring(0, 150)}...</p>
                    <div class="ville-info">
                        <span class="ville-region">📍 ${ville.region}</span>
                        <button class="btn-details" onclick="villesManager.showVilleDetails(${
                          ville.id
                        })">
                            Voir plus
                        </button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
  }

  filterVilles() {
    const searchTerm = this.searchInput.value.toLowerCase();
    const filteredVilles = this.villes.filter((ville) => {
      const matchSearch =
        ville.nom.toLowerCase().includes(searchTerm) ||
        ville.description.toLowerCase().includes(searchTerm);
      const matchFilter =
        this.currentFilter === "all" ||
        ville.region.toLowerCase() === this.currentFilter;
      return matchSearch && matchFilter;
    });
    this.displayVilles(filteredVilles);
  }

  async showVilleDetails(villeId) {
    try {
      const response = await fetch(`${API_URL}/villes/${villeId}`);
      const ville = await response.json();
      console.log(ville);

      this.villeDetails.innerHTML = `
                <div class="ville-details-content">
                    <div class="ville-header">
                        <h2>${ville.nom}</h2>
                        <button class="close-details" onclick="villesManager.hideVilleDetails()">×</button>
                    </div>
                    
                    <div class="ville-gallery">
                        <img src="${staticImage}${ville.image}" alt="${
        ville.nom
      }" class="main-image">
                        <div class="gallery-thumbs">
                            ${
                              ville.images
                                ? ville.images
                                    .map(
                                      (img) => `
                                <img src="${staticImage}${img.src}" alt="${ville.nom}" onclick="this.parentElement.previousElementSibling.src='${img.src}'">
                            `
                                    )
                                    .join("")
                                : ""
                            }
                        </div>
                    </div>
                    
                    <div class="ville-description">
                        <h3>À propos de ${ville.nom}</h3>
                        <p>${ville.description}</p>
                    </div>
                    
                    <div class="ville-histoire">
                        <h3>Histoire</h3>
                        <p>${ville.histoire}</p>
                    </div>
                    
                    <div class="ville-sites">
                        <h3>Sites Touristiques</h3>
                        <div class="sites-grid">
                            ${
                              ville.sites
                                ? ville.sites
                                    .map(
                                      (site) => `
                                <div class="site-card">
                                    <img src="${staticImage}${
                                        site.image
                                      }" alt="${site.nom}">
                                    <div class="info">
                                      <h4>${site.nom}</h4>
                                      <p>${site.description.substring(
                                        0,
                                        100
                                      )}...</p>
                                      <div class="site-info">
                                          <span>⏰ ${site.horaires}</span>
                                          <span>💰 ${site.tarifs}</span>
                                      </div>
                                    </div>
                                </div>
                            `
                                    )
                                    .join("")
                                : "<p>Aucun site touristique enregistré pour cette ville.</p>"
                            }
                        </div>
                    </div>
                    
                    <div class="ville-actualites">
                        <h3>Actualités Récentes</h3>
                        <div class="actualites-list">
                            ${
                              ville.actualites
                                ? ville.actualites
                                    .map(
                                      (actu) => `
                                <div class="actualite-card">
                                    <img src="${staticImage}${
                                        actu.image
                                      }" alt="${actu.titre}">
                                    <div class="actualite-content">
                                        <h4>${actu.titre}</h4>
                                        <span class="date">${new Date(
                                          actu.date
                                        ).toLocaleDateString()}</span>
                                        <p>${actu.contenu.substring(
                                          0,
                                          150
                                        )}...</p>
                                        <a href="/actualites.html?ville=${villeId}&id=${
                                        actu.id
                                      }">Lire la suite</a>
                                    </div>
                                </div>
                            `
                                    )
                                    .join("")
                                : "<p>Aucune actualité pour cette ville.</p>"
                            }
                        </div>
                    </div>
                </div>
            `;

      this.villeDetails.classList.add("active");
      this.villeDetails.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error(
        "Erreur lors du chargement des détails de la ville:",
        error
      );
    }
  }

  hideVilleDetails() {
    this.villeDetails.classList.remove("active");
  }

  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const villeId = urlParams.get("id");
    const siteId = urlParams.get("site");

    if (villeId) {
      this.showVilleDetails(villeId);
    }

    if (siteId) {
      // TODO: Implémenter l'affichage direct d'un site spécifique
    }
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  //   let villesManager;
  window.villesManager = new VillesManager();
});
