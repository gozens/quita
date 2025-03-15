import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import fs from "fs";
import "dotenv/config";
import { villesRouter } from "./routes/villes.js";
import { uploadRouter } from "./routes/upload.js";
import { authRouter } from "./routes/auth.js";
import { apiRouter } from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Créer les dossiers d'upload s'ils n'existent pas
const uploadDirs = ["heros", "villes", "sites", "actualites", "autres"];
for (const dir of uploadDirs) {
  const fullPath = path.join(__dirname, "uploads", dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
}

// Servir les fichiers statiques
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes API
app.use("/api/villes", villesRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/auth", authRouter);
app.use("/api", apiRouter);

// En mode développement, on redirige vers le serveur Vite
if (process.env.NODE_ENV === "development") {
  console.log("Mode développement activé - Redirection vers Vite");
  app.get("*", (req, res) => {
    res.redirect(FRONTEND_URL);
  });
}

// Gestion des erreurs avec plus de détails en développement
app.use((err, req, res, next) => {
  console.error("Erreur :", err.stack);
  res.status(500).json({
    error: "Une erreur est survenue !",
    details: process.env.NODE_ENV === "development" ? err.message : undefined,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

app.listen(PORT, () => {
  console.log("=".repeat(50));
  console.log(`Serveur démarré en mode ${process.env.NODE_ENV}`);
  console.log(`API disponible sur : http://localhost:${PORT}/api`);
  console.log(`Frontend sur : ${FRONTEND_URL}`);
  console.log("=".repeat(50));
});
