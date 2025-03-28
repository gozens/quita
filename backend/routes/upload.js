import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./auth.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Déterminer le dossier de destination en fonction du type d'image
    let uploadPath = path.join(__dirname, "../uploads");

    console.log(req.body.type, req.body.image);
    switch (req.body.type) {
      case "hero":
        uploadPath = path.join(uploadPath, "heros");
        break;
      case "villes":
        uploadPath = path.join(uploadPath, "villes");
        break;
      case "sites":
        uploadPath = path.join(uploadPath, "sites");
        break;
      case "actualites":
        uploadPath = path.join(uploadPath, "actualites");
        break;
      default:
        uploadPath = path.join(uploadPath, "autres");
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format de fichier non supporté. Utilisez JPG, PNG, GIF ou WebP."
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB
  },
});

// Route pour l'upload d'images (protégée)
router.post("/", verifyToken, upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Aucun fichier n'a été uploadé" });
    }

    // Construire l'URL de l'image
    const imageUrl = `/uploads/${req.body.type}/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl,
      filename: req.file.filename,
      type: req.body.type,
    });
  } catch (error) {
    console.error("Erreur lors de l'upload:", error);
    res.status(500).json({
      error: "Erreur lors de l'upload du fichier",
      details: error.message,
    });
  }
});

// Route pour supprimer une image (protégée)
router.delete("/:type/:filename", verifyToken, async (req, res) => {
  try {
    const { type, filename } = req.params;
    const filePath = path.join(__dirname, `../uploads/${type}/${filename}`);

    //vérifie si le fichier existe
    try {
      await fs.promises.access(filePath); // Vérifie si le fichier est accessible
    } catch (error) {
      return res.status(404).json({
        error: "Fichier non trouvé",
        details: error.message,
      });
    }

    await fs.promises.unlink(filePath);

    res.json({
      success: true,
      message: "Image supprimée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    res.status(500).json({
      error: "Erreur lors de la suppression du fichier",
      details: error.message,
    });
  }
});

export const uploadRouter = router;
