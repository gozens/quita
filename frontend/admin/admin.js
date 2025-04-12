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
  window.location.href = "./login.html";
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

window.addSiteModal = function (villeId) {
  document.getElementById("addSiteForm").dataset.villeId = villeId;
  openModal("addSiteModal");
};

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  loadVilles();
});
