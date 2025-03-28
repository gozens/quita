import Cookies from "js-cookie";
import messages from "../data/messages.json"; //doit venir du backend

// Vérification de l'authentification
if (!Cookies.get("adminToken")) {
  window.location.href = "/admin/login.html";
}

// Gestion de la déconnexion
document.getElementById("logoutBtn").addEventListener("click", () => {
  Cookies.remove("adminToken");
  window.location.href = "/admin/login.html";
});

// Affichage des messages
function displayMessages() {
  const messagesList = document.getElementById("messagesList");
  messagesList.innerHTML = "";

  if (messages.messages.length === 0) {
    messagesList.innerHTML =
      '<p class="no-messages">Aucun message pour le moment.</p>';
    return;
  }

  messages.messages.forEach((message, index) => {
    const messageCard = document.createElement("div");
    messageCard.className = "message-card";
    messageCard.innerHTML = `
            <div class="message-header">
                <h3>${message.subject}</h3>
                <span class="message-date">${new Date(
                  message.date
                ).toLocaleString()}</span>
            </div>
            <div class="message-info">
                <p><strong>De:</strong> ${message.name}</p>
                <p><strong>Email:</strong> ${message.email}</p>
            </div>
            <div class="message-content">
                <p>${message.message}</p>
            </div>
            <div class="message-actions">
                <button class="delete-btn" data-index="${index}">Supprimer</button>
            </div>
        `;
    messagesList.appendChild(messageCard);
  });

  // Gestion de la suppression des messages
  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", async () => {
      const index = parseInt(button.dataset.index);
      messages.messages.splice(index, 1);

      try {
        // Ici, vous pouvez ajouter la logique pour sauvegarder dans un vrai backend
        displayMessages();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        alert("Erreur lors de la suppression du message");
      }
    });
  });
}
