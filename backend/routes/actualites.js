import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { verifyToken } from "./auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dataPath = path.join(__dirname, "../data/villes.json");

// Fonction utilitaire pour lire le fichier JSON
async function readActualitesFile() {
  try {
    const data = await fs.readFile(dataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      // Si le fichier n'existe pas, créer un tableau vide
      await fs.writeFile(dataPath, "[]", "utf8");
      return [];
    }
    throw error;
  }
}

// Fonction utilitaire pour écrire dans le fichier JSON
async function writeActualitesFile(data) {
  await fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8");
}

// Récupérer toutes les villes
router.get("/", async (req, res) => {
  // return res.json({"response": "je suis ici"});
  try {
    const actualites = await readActualitesFile();
    // return res.json({"response": "je suis ici"})
    res.json(actualites);
  } catch (error) {
    console.error("Erreur lors de la lecture des actualités:", error);
    res.status(500).json({ error: "Erreur lors de la lecture des actualités" });
  }
});

// Récupérer une ville spécifique
router.get("/:id", async (req, res) => {
  try {
    const actualites = await readActualitesFile();
    const actualite = actualites.find((v) => v.id === req.params.id);

    if (!actualite) {
      return res.status(404).json({ error: "Ville non trouvée" });
    }

    res.json(actualite);
  } catch (error) {
    console.error("Erreur lors de la lecture de la ville:", error);
    res.status(500).json({ error: "Erreur lors de la lecture de la ville" });
  }
});

// Ajouter une nouvelle ville (protégé)
router.post("/", verifyToken, async (req, res) => {
  // return res.json({"response": "je suis ici"});
  try {
    const actualites = await readActualitesFile();
    const newActualite = {
      id: Date.now().toString(),
      nom: req.body.nom,
      description: req.body.description,
      image: req.body.image,
      population: req.body.population,
      region: req.body.region,
      sites: [],
      actualites: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    actualites.push(newActualite);
    await writeActualitesFile(actualites);
    res.status(201).json(newActualite);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'actualité:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'actalité" });
  }
});

// Mettre à jour une ville (protégé)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const actualites = await readActualitesFile();
    const index = actualites.findIndex((v) => v.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Ville non trouvée" });
    }

    const updatedVille = {
      ...actualites[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    actualites[index] = updatedVille;
    await writeActualitesFile(actualites);
    res.json(updatedVille);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la ville:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la mise à jour de la ville" });
  }
});

// Supprimer une ville (protégé)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const actualites = await readActualitesFile();
    const filteredActualites = actualites.filter((v) => v.id !== req.params.id);

    if (filteredActualites.length === actualites.length) {
      return res.status(404).json({ error: "Ville non trouvée" });
    }

    await writeActualitesFile(filteredActualites);
    res.status(200).json({ message: "Actualité supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'actualité:", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'actualité" });
  }
});

// Ajouter un site touristique à une ville (protégé)
router.post("/:id/sites", verifyToken, async (req, res) => {
  try {
    const villes = await readActualitesFile();
    const index = villes.findIndex((v) => v.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Ville non trouvée" });
    }

    const newSite = {
      id: Date.now().toString(),
      nom: req.body.nom,
      description: req.body.description,
      image: req.body.image,
      categorie: req.body.categorie,
      createdAt: new Date().toISOString(),
    };

    villes[index].sites.push(newSite);
    villes[index].updatedAt = new Date().toISOString();

    await writeActualitesFile(villes);
    res.status(201).json(newSite);
  } catch (error) {
    console.error("Erreur lors de l'ajout du site:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout du site" });
  }
});

// Ajouter une actualité à une ville (protégé)
router.post("/:id/actualites", verifyToken, async (req, res) => {
  try {
    const villes = await readActualitesFile();
    const index = villes.findIndex((v) => v.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: "Ville non trouvée" });
    }

    const newActualite = {
      id: Date.now().toString(),
      titre: req.body.titre,
      contenu: req.body.contenu,
      image: req.body.image,
      categorie: req.body.categorie,
      createdAt: new Date().toISOString(),
    };

    villes[index].actualites.push(newActualite);
    villes[index].updatedAt = new Date().toISOString();

    await writeActualitesFile(villes);
    res.status(201).json(newActualite);
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'actualité:", error);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'actualité" });
  }
});

export const villesRouter = router;
