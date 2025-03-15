import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyToken } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const dataPath = path.join(__dirname, '../data/villes.json');

// Fonction utilitaire pour lire le fichier JSON
async function readVillesFile() {
    try {
        const data = await fs.readFile(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            // Si le fichier n'existe pas, créer un tableau vide
            await fs.writeFile(dataPath, '[]', 'utf8');
            return [];
        }
        throw error;
    }
}

// Fonction utilitaire pour écrire dans le fichier JSON
async function writeVillesFile(data) {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Récupérer toutes les villes
router.get('/', async (req, res) => {
    // return res.json({"response": "je suis ici"});
    try {
        const villes = await readVillesFile();
        // return res.json({"response": "je suis ici"})
        res.json(villes);
    } catch (error) {
        console.error('Erreur lors de la lecture des villes:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture des villes' });
    }
});

// Récupérer une ville spécifique
router.get('/:id', async (req, res) => {
    try {
        const villes = await readVillesFile();
        const ville = villes.find(v => v.id === req.params.id);
        
        if (!ville) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }
        
        res.json(ville);
    } catch (error) {
        console.error('Erreur lors de la lecture de la ville:', error);
        res.status(500).json({ error: 'Erreur lors de la lecture de la ville' });
    }
});

// Ajouter une nouvelle ville (protégé)
router.post('/', verifyToken, async (req, res) => {
    // return res.json({"response": "je suis ici"});
    try {
        const villes = await readVillesFile();
        const newVille = {
            id: Date.now().toString(),
            nom: req.body.nom,
            description: req.body.description,
            image: req.body.image,
            population: req.body.population,
            region: req.body.region,
            sites: [],
            actualites: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        villes.push(newVille);
        await writeVillesFile(villes);
        res.status(201).json(newVille);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la ville:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la ville' });
    }
});

// Mettre à jour une ville (protégé)
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const villes = await readVillesFile();
        const index = villes.findIndex(v => v.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }
        
        const updatedVille = {
            ...villes[index],
            ...req.body,
            updatedAt: new Date().toISOString()
        };
        
        villes[index] = updatedVille;
        await writeVillesFile(villes);
        res.json(updatedVille);
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la ville:', error);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de la ville' });
    }
});

// Supprimer une ville (protégé)
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const villes = await readVillesFile();
        const filteredVilles = villes.filter(v => v.id !== req.params.id);
        
        if (filteredVilles.length === villes.length) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }
        
        await writeVillesFile(filteredVilles);
        res.status(200).json({ message: 'Ville supprimée avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression de la ville:', error);
        res.status(500).json({ error: 'Erreur lors de la suppression de la ville' });
    }
});

// Ajouter un site touristique à une ville (protégé)
router.post('/:id/sites', verifyToken, async (req, res) => {
    try {
        const villes = await readVillesFile();
        const index = villes.findIndex(v => v.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }
        
        const newSite = {
            id: Date.now().toString(),
            nom: req.body.nom,
            description: req.body.description,
            image: req.body.image,
            categorie: req.body.categorie,
            createdAt: new Date().toISOString()
        };
        
        villes[index].sites.push(newSite);
        villes[index].updatedAt = new Date().toISOString();
        
        await writeVillesFile(villes);
        res.status(201).json(newSite);
    } catch (error) {
        console.error('Erreur lors de l\'ajout du site:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout du site' });
    }
});

// Ajouter une actualité à une ville (protégé)
router.post('/:id/actualites', verifyToken, async (req, res) => {
    try {
        const villes = await readVillesFile();
        const index = villes.findIndex(v => v.id === req.params.id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }
        
        const newActualite = {
            id: Date.now().toString(),
            titre: req.body.titre,
            contenu: req.body.contenu,
            image: req.body.image,
            categorie: req.body.categorie,
            createdAt: new Date().toISOString()
        };
        
        villes[index].actualites.push(newActualite);
        villes[index].updatedAt = new Date().toISOString();
        
        await writeVillesFile(villes);
        res.status(201).json(newActualite);
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'actualité:', error);
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'actualité' });
    }
});

export const villesRouter = router;
