import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Changé à 3001 pour éviter les conflits avec Vite

// Middleware
app.use(cors());
app.use(express.json());

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "../public")));
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Routes API
app.use("/api", apiRoutes);

// Gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Une erreur est survenue !" });
});

// Route par défaut pour le frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin/admin.html"));
});

app.listen(PORT, () => {
  console.log(`Serveur API démarré sur le port ${PORT}`);
});
