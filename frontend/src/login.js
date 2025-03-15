import Cookies from "js-cookie";

document
  .getElementById("loginForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Stocker le token dans un cookie
        // let Cookies = document.cookie;
        Cookies.set("adminToken", data.token, { expires: 1 }); // Expire après 1 jour
        // Cookies = "adminToken=" + data.token;
        console.log(Cookies);
        // Rediriger vers l'interface d'administration
        window.location.href = "/admin/admin.html";
      } else {
        showError("Nom d'utilisateur ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      showError("Une erreur est survenue lors de la connexion");
    }
  });

function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message visible";
  errorDiv.textContent = message;

  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  document.querySelector(".login-box").appendChild(errorDiv);
}
