import express from "express";
import { verifyToken } from "./auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Configuration de multer pour l'upload de fichiers
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Routes pour les villes
router.get("/villes", async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    const villes = [
      {
        id: 1,
        nom: "Abidjan",
        description: "La capitale économique de la Côte d'Ivoire",
        image: "/images/abidjan.jpg",
        region: "Sud",
      },
      // Autres villes...
    ];
    res.json(villes);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des villes" });
  }
});

// router.post('/villes', verifyToken, async (req, res) => {
//     try {
//         const nouvelleVille = req.body;
//         // TODO: Ajouter la ville dans la base de données
//         res.status(201).json(nouvelleVille);
//     } catch (error) {
//         res.status(500).json({ error: 'Erreur lors de la création de la ville' });
//     }
// });

// Routes pour les sites touristiques
router.get("/sites", async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    const sites = [
      {
        id: 1,
        nom: "Basilique Notre-Dame de la Paix",
        description: "La plus grande basilique du monde",
        image: "/images/basilique.jpg",
        ville: "Yamoussoukro",
        horaires: "8h-18h",
        tarifs: "5000 FCFA",
      },
      // Autres sites...
    ];
    res.json(sites);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des sites" });
  }
});

router.post("/sites", verifyToken, async (req, res) => {
  try {
    const nouveauSite = req.body;
    // TODO: Ajouter le site dans la base de données
    res.status(201).json(nouveauSite);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du site" });
  }
});

// Routes pour les actualités
router.get("/actualites", async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    const actualites = [
      {
        id: 1,
        titre: "Festival des Arts et de la Culture",
        contenu: "Le grand festival annuel des arts et de la culture...",
        image: "/images/festival.jpg",
        date: "2025-03-15",
        categorie: "Culture",
      },
      // Autres actualités...
    ];
    res.json(actualites);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des actualités" });
  }
});

router.post("/actualites", verifyToken, async (req, res) => {
  try {
    const nouvelleActualite = req.body;
    // TODO: Ajouter l'actualité dans la base de données
    res.status(201).json(nouvelleActualite);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'actualité" });
  }
});

// Routes pour la médiathèque
router.get("/media", async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    const media = [
      {
        id: 1,
        nom: "plage.jpg",
        url: "/uploads/plage.jpg",
        taille: 1024576,
      },
      // Autres médias...
    ];
    res.json(media);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des médias" });
  }
});

router.post(
  "/media/upload",
  verifyToken,
  upload.single("media"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: "Aucun fichier n'a été téléchargé" });
      }

      const media = {
        nom: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        taille: req.file.size,
      };
      // TODO: Sauvegarder les informations du média dans la base de données
      res.status(201).json(media);
    } catch (error) {
      res
        .status(500)
        .json({ error: "Erreur lors du téléchargement du fichier" });
    }
  }
);

// Routes pour les statistiques
router.get("/villes/count", verifyToken, async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    res.json(10);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du comptage des villes" });
  }
});

router.get("/sites/count", verifyToken, async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    res.json(25);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du comptage des sites" });
  }
});

router.get("/actualites/count", verifyToken, async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    res.json(15);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du comptage des actualités" });
  }
});

router.get("/messages/count", verifyToken, async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    res.json(5);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du comptage des messages" });
  }
});

// Route pour les activités récentes
router.get("/activities", verifyToken, async (req, res) => {
  try {
    // TODO: Remplacer par une requête à la base de données
    const activities = [
      {
        id: 1,
        description: "Nouvelle ville ajoutée : Grand-Bassam",
        date: new Date(),
      },
      {
        id: 2,
        description: "Mise à jour du site touristique : Parc National de Taï",
        date: new Date(Date.now() - 3600000),
      },
      // Autres activités...
    ];
    res.json(activities);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des activités" });
  }
});

export const apiRouter = router;
