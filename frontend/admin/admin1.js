// Configuration temporaire pour le développement
const Cokie = (document.cookie = "adminToken=temp_token");
// Cookies.set('adminToken', 'temp_token');

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

// Fonction pour gérer l'upload d'image
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return null;
  }
}

// Fonction pour ajouter une ville
document
  .getElementById("addVilleForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const imageFile = formData.get("image");

    const imageUrl = await uploadImage(imageFile);
    if (!imageUrl) return;

    const newVille = {
      nom: formData.get("nom"),
      description: formData.get("description"),
      image: imageUrl,
      histoire: {
        creation: formData.get("creation"),
        contenu: formData.get("histoire"),
      },
      actualites: [],
      sites: [],
    };

    try {
      const response = await fetch("/api/villes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
        body: JSON.stringify(newVille),
      });

      if (response.ok) {
        await loadVilles();
        closeModal("addVilleModal");
        event.target.reset();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  });

// Fonction pour ajouter un site touristique
document
  .getElementById("addSiteForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const villeId = event.target.dataset.villeId;
    const formData = new FormData(event.target);
    const imageFile = formData.get("image");

    const imageUrl = await uploadImage(imageFile);
    if (!imageUrl) return;

    const newSite = {
      nom: formData.get("nom"),
      description: formData.get("description"),
      image: imageUrl,
      horaires: formData.get("horaires"),
      tarifs: formData.get("tarifs"),
    };

    try {
      const response = await fetch(`/api/villes/${villeId}/sites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
        body: JSON.stringify(newSite),
      });

      if (response.ok) {
        await loadVilles();
        closeModal("addSiteModal");
        event.target.reset();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout du site:", error);
    }
  });

// Fonction pour ajouter une actualité
document
  .getElementById("addActuForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const villeId = event.target.dataset.villeId;
    const formData = new FormData(event.target);
    const imageFile = formData.get("image");

    const imageUrl = await uploadImage(imageFile);
    if (!imageUrl) return;

    const newActu = {
      titre: formData.get("titre"),
      date: formData.get("date"),
      contenu: formData.get("contenu"),
      image: imageUrl,
    };

    try {
      const response = await fetch(`/api/villes/${villeId}/actualites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
        body: JSON.stringify(newActu),
      });

      if (response.ok) {
        await loadVilles();
        closeModal("addActuModal");
        event.target.reset();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'actualité:", error);
    }
  });

// Charger les villes depuis l'API
async function loadVilles() {
  try {
    const response = await fetch("/api/villes");
    const data = await response.json();
    displayVilles(data);
  } catch (error) {
    console.error("Erreur lors du chargement des villes:", error);
  }
}

// Affichage des villes
function displayVilles(villes) {
  const villesList = document.getElementById("villesList");
  villesList.innerHTML = "";

  Object.entries(villes).forEach(([id, ville]) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
            <div class="item-header">
                <img src="${ville.image}" alt="${ville.nom}" class="item-image">
                <h3>${ville.nom}</h3>
            </div>
            <p>${ville.description}</p>
            <div class="item-details">
                <h4>Histoire</h4>
                <p>Création: ${ville.histoire?.creation}</p>
                <p>${ville.histoire?.contenu}</p>
                
                <h4>Sites Touristiques (${ville.sites.length})</h4>
                <div class="sites-list">
                    ${ville.sites
                      .map(
                        (site) => `
                        <div class="site-item">
                            <img src="${site.image}" alt="${site.nom}">
                            <h5>${site.nom}</h5>
                        </div>
                    `
                      )
                      .join("")}
                </div>

                <h4>Actualités (${ville.actualites.length})</h4>
                <div class="actualites-list">
                    ${ville.actualites
                      .map(
                        (actu) => `
                        <div class="actu-item">
                            <h5>${actu.titre}</h5>
                            <p>${actu.date}</p>
                        </div>
                    `
                      )
                      .join("")}
                </div>
            </div>
            <div class="item-actions">
                <button class="btn" onclick="addSiteModal('${id}')">Ajouter un site</button>
                <button class="btn" onclick="addActuModal('${id}')">Ajouter une actualité</button>
                <button class="delete-btn" onclick="deleteVille('${id}')">Supprimer</button>
            </div>
        `;
    villesList.appendChild(card);
  });
}

// Fonctions pour les modals
window.openModal = function (modalId) {
  document.getElementById(modalId).style.display = "block";
};

window.closeModal = function (modalId) {
  document.getElementById(modalId).style.display = "none";
};

// Gestionnaires d'événements pour les boutons d'ajout
document.getElementById("addVilleBtn").addEventListener("click", () => {
  openModal("addVilleModal");
});

window.addSiteModal = function (villeId) {
  document.getElementById("addSiteForm").dataset.villeId = villeId;
  openModal("addSiteModal");
};

window.addActuModal = function (villeId) {
  document.getElementById("addActuForm").dataset.villeId = villeId;
  openModal("addActuModal");
};

// Suppression d'une ville
window.deleteVille = async function (villeId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette ville ?")) return;

  try {
    const response = await fetch(`/api/villes/${villeId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("adminToken")}`,
      },
    });

    if (response.ok) {
      await loadVilles();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
};

// Gestion de la déconnexion
document.getElementById("logoutBtn").addEventListener("click", () => {
  Cookies.remove("adminToken");
  window.location.href = "/login.html";
});

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  loadVilles();
});
