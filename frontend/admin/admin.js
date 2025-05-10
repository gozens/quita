import Cookies from "js-cookie";
import { uploadImage, loadVilles, displayVilles } from "./function.js";

// Configuration temporaire pour le développement
Cookies.set("adminToken", "temp_token");

// Vérification de l'authentification
if (!Cookies.get("adminToken")) {
  window.location.href = "./login.html";
}

// Gestion de la déconnexion
document.getElementById("logoutBtn").addEventListener("click", () => {
  Cookies.remove("adminToken");
  window.location.href = "/";
});

// Affichage des villes

// Gestion des onglets
document.querySelectorAll(".tab-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".tab-btn")
      .forEach((btn) => btn.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    document.getElementById(button.dataset.tab).classList.add("active");
  });
});

// Fonctions pour les modals
window.openModal = function (modalId) {
  document.getElementById(modalId).style.display = "block";
};

window.closeModal = function (modalId) {
  document.getElementById(modalId).style.display = "none";
};

// window.addVilleModal = function () {
//   openModal("addVilleModal");
// };

document.getElementById("addVilleBtn").addEventListener("click", () => {
  openModal("addVilleModal");
});

// window.addSiteModal = function (villeId, actuId = null) {
//   document.getElementById("addSiteForm").dataset.villeId = villeId;
//   openModal("addSiteModal");
// };

window.addSiteModal = async function (villeId, siteId = null) {
  console.log(villeId, siteId);
  if (siteId !== null) {
    try {
      const response = await fetch(`/api/villes/${villeId}/sites/${siteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const site = await response.json();
      if (response.ok) {
        console.log(site);
        document.getElementById("addSiteForm").dataset.siteId = siteId;
        document
          .getElementById("addSiteForm")
          .addEventListener("submit", function (event) {
            updateSite(event);
          });
        document.getElementById("siteName").value = site.nom;
        document.getElementById("siteDescription").value = site.description;
        document.getElementById("horaires").value = site.horaires;
        document.getElementById("tarifs").value = site.tarifs;
        // console.log("Tarifs", tarifs);
        document.getElementById("siteImage").src = site.image[0];
        document.getElementById("addSiteBtnForm").textContent = "Modifier";
        document.getElementById("titleSiteForm").textContent =
          "Modifier le site " + site.nom;
      }
    } catch (error) {
      console.error("Erreur lors de la requète:", error);
    }
  }
  document.getElementById("addSiteForm").dataset.villeId = villeId;
  openModal("addSiteModal");
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  loadVilles();
});

// Fonction pour modifier un site
window.updateSite = async function (event) {
  event.preventDefault();
  const villeId = event.target.getAttribute("data-ville-id");
  const siteId = event.target.getAttribute("data-site-id");

  const formData = new FormData(document.getElementById("addSiteForm"));
  const imageFile = formData.get("image");

  const imageUrl = await uploadImage(imageFile, "sites");
  if (!imageUrl) return;

  const newSite = {
    nom: formData.get("nom"),
    description: formData.get("description"),
    horaires: formData.get("horaires"),
    image: imageUrl,
    tarifs: formData.get("tarifs"),
  };

  try {
    const response = await fetch(`/api/villes/${villeId}/sites/${siteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("adminToken")}`,
      },
      body: JSON.stringify(newSite),
    });

    if (response.ok) {
      await loadVilles();
      closeModal("addSiteModal");
      document.getElementById("addSiteForm").reset();
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du site:", error);
  }
};

//Animation du décompte dashbord
function animateCount(element, target, duration = 1000) {
  const start = 0;
  // console.log(typeof target);
  const increment = target / (duration / 10);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.innerText = Math.floor(current);
  }, 10);
}

export function displayStats(stats) {
  console.log(stats);
  const ville = document.querySelector("#villesCount");
  const site = document.querySelector("#sitesCount");
  const actualite = document.querySelector("#actualitesCount");

  const villesCount = parseInt(stats.villes, 10);
  const sitesCount = parseInt(stats.sites, 10);
  const actualitesCount = parseInt(stats.actualites, 10);

  animateCount(ville, villesCount);
  animateCount(site, sitesCount);
  animateCount(actualite, actualitesCount);
}
