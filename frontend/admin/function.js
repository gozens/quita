import { displayStats } from "./admin.js";

const staticImage = "http://localhost:3001";

// Fonction pour gérer l'upload d'image
export async function uploadImage(file, type) {
  const formData = new FormData();
  formData.append("type", type);
  formData.append("image", file);

  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${Cookies.get("adminToken")}`,
      },
    });
    const data = await response.json();
    return data.imageUrl;
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    return null;
  }
}

// Fonction pour ajouter une ville
window.addVille = async function (event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const imageFile = formData.get("image");

  const imageUrl = await uploadImage(imageFile, "villes");
  if (!imageUrl) return;

  const newVille = {
    nom: formData.get("nom"),
    description: formData.get("description"),
    image: imageUrl,
    population: formData.get("population"),
    region: formData.get("region"),
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
      try {
        closeModal("addVilleModal");
        await loadVilles();
        event.target.reset();
      } catch (error) {
        console.error("Error loading pour la deuxème requète", error);
      }
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout:", error);
  }
};

// Charger les villes depuis l'API
export async function loadVilles() {
  try {
    const response = await fetch("/api/villes");
    const response1 = await fetch("/api/composants/sites");
    const response2 = await fetch("/api/composants/actualites");
    const response3 = await fetch("/api/composants/stats");
    const data = await response.json();
    const sites = await response1.json();
    const actualites = await response2.json();
    const stats = await response3.json();

    displayStats(stats);
    displayVilles(data);
    displayActualites(actualites);
    displaySites(sites);
  } catch (error) {
    console.error("Erreur lors du chargement des villes:", error);
  }
}

export function displayVilles(villes) {
  const villesList = document.getElementById("villesList");
  villesList.innerHTML = "";

  Object.entries(villes).forEach(([id, ville]) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
                <div class="item-header">
                    <img src="${staticImage}${ville.image}" alt="${
      ville.nom
    }" class="item-image">
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
                                <img src="${staticImage}${site.image}" alt="${site.nom}">
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
                    <button class="btn" onclick="addSiteModal('${
                      ville.id
                    }')">Ajouter un site</button>
                    <button class="btn" onclick="addActuModal('${
                      ville.id
                    }')">Ajouter une actualité</button>
                    <button class="delete-btn" onclick="deleteVille('${
                      ville.id
                    }')">Supprimer</button>
                </div>
            `;
    villesList.appendChild(card);
  });
}

export function displayActualites(actualites) {
  const actualitesList = document.getElementById("actualitesList");
  actualitesList.innerHTML = "";

  Object.entries(actualites).forEach(([id, actualite]) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
                <div class="item-header">
                    <img src="${staticImage}${actualite.image}" alt="${actualite.titre}" class="item-image">
                    <h3>${actualite.titre}</h3>
                </div>
                <p>${actualite.contenu}</p>
                <div class="item-actions">
                    <button class="btn" onclick="addActuModal('${actualite.villeId}', '${actualite.id}')">Modifier</button>
                    <button class="delete-btn" onclick="deleteActualite('${actualite.villeId}', '${actualite.id}')">Supprimer</button>
                </div>
            `;
    actualitesList.appendChild(card);
  });
}

export function displaySites(sites) {
  const sitesList = document.getElementById("sitesList");
  sitesList.innerHTML = "";

  Object.entries(sites).forEach(([id, site]) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
                <div class="item-header">
                    <img src="${staticImage}${site.image}" alt="${site.nom}" class="item-image">
                    <h3>${site.nom}</h3>
                </div>
                <p>${site.description}</p>
                <div class="item-details">
                    <h4>Horaires</h4>
                    <p>${site.horaires}</p>
                    <h4>Tarifs</h4>
                    <p>${site.tarifs}</p>
                </div>
                <div class="item-actions">
                    <button class="btn" onclick="addSiteModal('${site.villeId}', '${site.id}')">Modifier</button>
                    <button class="delete-btn" onclick="deleteSite('${site.villeId}', '${site.id}')">Supprimer</button>
                </div>
            `;
    sitesList.appendChild(card);
  });
}

// Fonction pour ajouter un site touristique
window.addSite = async function (event) {
  event.preventDefault();
  const villeId = event.target.getAttribute("data-ville-id");
  const formData = new FormData(document.getElementById("addSiteForm"));
  const imageFile = formData.get("image");
  const imageUrl = await uploadImage(imageFile, "sites");
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
      document.getElementById("addSiteForm").reset();
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout du site:", error);
  }
};

// Fonction pour ajouter une actualité
window.addActualite = async function (event) {
  event.preventDefault();
  const villeId = event.target.getAttribute("data-ville-id");

  const formData = new FormData(document.getElementById("addActuForm"));
  const imageFile = formData.get("image");

  const imageUrl = await uploadImage(imageFile, "actualites");
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
      document.getElementById("addActuForm").reset();
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'actualité:", error);
  }
};

// Fonction pour modifier une actualité
window.updateActualite = async function (event) {
  event.preventDefault();
  const villeId = event.target.getAttribute("data-ville-id");
  const actuId = event.target.getAttribute("data-actu-id");

  const formData = new FormData(document.getElementById("addActuForm"));
  const imageFile = formData.get("image");

  const imageUrl = await uploadImage(imageFile, "actualites");
  if (!imageUrl) return;

  const newActu = {
    titre: formData.get("titre"),
    date: formData.get("date"),
    contenu: formData.get("contenu"),
    image: imageUrl,
  };

  try {
    const response = await fetch(
      `/api/villes/${villeId}/actualites/${actuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
        body: JSON.stringify(newActu),
      }
    );

    if (response.ok) {
      await loadVilles();
      closeModal("addActuModal");
      document.getElementById("addActuForm").reset();
    }
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'actualité:", error);
  }
};

window.addActuModal = async function (villeId, actuId = null) {
  if (actuId !== null) {
    try {
      const response = await fetch(
        `/api/villes/${villeId}/actualites/${actuId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const actualite = await response.json();
      if (response.ok) {
        console.log(actualite.titre);
        document.getElementById("addActuForm").dataset.actuId = actuId;
        document
          .getElementById("addActuForm")
          .addEventListener("submit", function (event) {
            updateActualite(event);
          });
        document.getElementById("actuTitre").value = actualite.titre;
        document.getElementById("actuDate").value = actualite.date;
        document.getElementById("actuContenu").value = actualite.contenu;
        document.getElementById("actuImage").src = actualite.image;
        document.getElementById("addActuBtnForm").textContent = "Modifier";
      }
    } catch (error) {
      console.error("Erreur lors de la requète:", error);
    }
  }
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

window.deleteActualite = async function (villeId, actualiteId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) return;
  // console.log(e);

  try {
    const response = await fetch(
      `/api/villes/${villeId}/actualites/${actualiteId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${Cookies.get("adminToken")}`,
        },
      }
    );

    if (response.ok) {
      // const response2 = await fetch("/api/composants/actualites");
      // const actualites = response2.json();
      // displayActualites(actualites);
      await loadVilles();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
};

window.deleteSite = async function (villeId, siteId) {
  if (!confirm("Êtes-vous sûr de vouloir supprimer ce site ?")) return;

  try {
    const response = await fetch(`/api/villes/${villeId}/sites/${siteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${Cookies.get("adminToken")}`,
      },
    });

    if (response.ok) {
      loadVilles();
    }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
  }
};
