// Configuration de l'API
const API_URL = "http://localhost:3001/api";

// Gestionnaire de la page d'accueil
class HomeManager {
  constructor() {
    this.citiesGrid = document.getElementById("cities-grid");
    this.newsContainer = document.getElementById("news-container");
    this.sitesContainer = document.getElementById("sites-container");

    this.init();
  }

  async init() {
    await Promise.all([
      this.loadFeaturedCities(),
      this.loadLatestNews(),
      this.loadPopularSites(),
    ]);
  }

  async loadFeaturedCities() {
    try {
      const response = await fetch(`${API_URL}/villes`);
      const cities = await response.json();

      this.citiesGrid.innerHTML = cities
        .map(
          (city) => `
                <div class="city-card" data-id="${city.id}">
                    <div class="city-image">
                        <img src="${city.image}" alt="${city.nom}">
                    </div>
                    <div class="city-content">
                        <h3>${city.nom}</h3>
                        <p>${city.description.substring(0, 100)}...</p>
                        <a href="/villes.html?id=${
                          city.id
                        }" class="btn-discover">Découvrir</a>
                    </div>
                </div>
            `
        )
        .join("");
    } catch (error) {
      console.error("Erreur lors du chargement des villes:", error);
      this.citiesGrid.innerHTML =
        '<p class="error-message">Impossible de charger les villes pour le moment.</p>';
    }
  }

  async loadLatestNews() {
    try {
      const response = await fetch(`${API_URL}/actualites`);
      const news = await response.json();

      this.newsContainer.innerHTML = news
        .slice(0, 3)
        .map(
          (item) => `
                <div class="news-card">
                    <div class="news-image">
                        <img src="${item.image}" alt="${item.titre}">
                    </div>
                    <div class="news-content">
                        <span class="news-date">${new Date(
                          item.date
                        ).toLocaleDateString()}</span>
                        <h3>${item.titre}</h3>
                        <p>${item.contenu.substring(0, 150)}...</p>
                        <a href="/actualites.html?id=${
                          item.id
                        }" class="read-more">Lire la suite</a>
                    </div>
                </div>
            `
        )
        .join("");
    } catch (error) {
      console.error("Erreur lors du chargement des actualités:", error);
      this.newsContainer.innerHTML =
        '<p class="error-message">Impossible de charger les actualités pour le moment.</p>';
    }
  }

  async loadPopularSites() {
    try {
      const response = await fetch(`${API_URL}/sites`);
      const sites = await response.json();

      this.sitesContainer.innerHTML = sites
        .slice(0, 4)
        .map(
          (site) => `
                <div class="site-card">
                    <div class="site-image">
                        <img src="${site.image}" alt="${site.nom}">
                    </div>
                    <div class="site-content">
                        <h3>${site.nom}</h3>
                        <p>${site.description.substring(0, 80)}...</p>
                        <div class="site-info">
                            <span class="site-location">📍 ${site.ville}</span>
                            <a href="/villes.html?site=${
                              site.id
                            }" class="btn-visit">Visiter</a>
                        </div>
                    </div>
                </div>
            `
        )
        .join("");
    } catch (error) {
      console.error("Erreur lors du chargement des sites:", error);
      this.sitesContainer.innerHTML =
        '<p class="error-message">Impossible de charger les sites pour le moment.</p>';
    }
  }
}

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  new HomeManager();
});

document.querySelector(".toggle-menu").addEventListener("click", () => {
  const navLinks = document.querySelector(".nav-links");
  navLinks.classList.toggle("active");
});
