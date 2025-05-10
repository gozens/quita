import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { readVillesFile, writeVillesFile } from "./villes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dataPath = path.join(__dirname, "../data/villes.json");

// Fonction utilitaire pour lire le fichier JSON
async function readActualitesFile() {
  try {
    const villes = await readVillesFile();

    let allActualites = [];
    villes.forEach((ville) => {
      allActualites = allActualites.concat(
        ville.actualites.map((actualite) => ({
          ...actualite,
          villeId: ville.id,
        }))
      );
    });

    return allActualites;
  } catch (error) {
    if (error.code === "ENOENT") {
      // Si le fichier n'existe pas, returné un tableau vide
      return [];
    }
    throw error;
  }
}

async function readSitesFile() {
  try {
    const villes = await readVillesFile();

    let allSites = [];
    villes.forEach((ville) => {
      allSites = allSites.concat(
        ville.sites.map((site) => ({ ...site, villeId: ville.id }))
      );
    });

    return allSites;
  } catch (error) {
    if (error.code === "ENOENT") {
      // Si le fichier n'existe pas, returné un tableau vide
      return [];
    }
    throw error;
  }
}

//Lire toutes les actualités (pas spécifique à une ville)
router.get("/actualites", async (req, res) => {
  try {
    const actualites = await readActualitesFile();
    res.json(actualites);
  } catch (error) {
    console.error("Erreur lors de la lecture des actualites:", error);
    res.status(500).json({ error: "Erreur lors de la lecture des actualites" });
  }
});

router.get("/sites", async (req, res) => {
  try {
    const sites = await readSitesFile();
    res.json(sites);
  } catch (error) {
    console.error("Erreur lors de la lecture des sites:", error);
    res.status(500).json({ error: "Erreur lors de la lecture des sites" });
  }
});

router.get("/stats", async (req, res) => {
  try {
    const villes = await readVillesFile();

    let totalSites = 0;
    let totalActualites = 0;

    villes.forEach((ville) => {
      totalSites += ville.sites ? ville.sites.length : 0;
      totalActualites += ville.actualites ? ville.actualites.length : 0;
    });

    const stats = {
      villes: Number(villes.length),
      sites: Number(totalSites),
      actualites: Number(totalActualites),
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error("Erreur lors du calcul des stats :", error);
    res.status(500).json({ error: "Erreur lors du calcul des statistiques." });
  }
});

export const composantsRouter = router;
