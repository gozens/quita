import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configuration de multer pour l'upload des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Limite de 5MB
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Seules les images sont autorisées'));
    }
});

// Chemin vers le fichier JSON des villes
const VILLES_FILE = path.join(__dirname, '../../data/villes.json');

// Fonction utilitaire pour lire le fichier JSON
async function readVillesFile() {
    const data = await fs.readFile(VILLES_FILE, 'utf8');
    return JSON.parse(data);
}

// Fonction utilitaire pour écrire dans le fichier JSON
async function writeVillesFile(data) {
    await fs.writeFile(VILLES_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Upload d'image
router.post('/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Aucune image n\'a été uploadée' });
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
});

// Récupérer toutes les villes
router.get('/villes', async (req, res) => {
    try {
        const villes = await readVillesFile();
        res.json(villes);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la lecture des villes' });
    }
});

// Ajouter une nouvelle ville
router.post('/villes', async (req, res) => {
    try {
        const villes = await readVillesFile();
        const villeId = req.body.nom.toLowerCase().replace(/\s+/g, '-');
        
        if (villes[villeId]) {
            return res.status(400).json({ error: 'Cette ville existe déjà' });
        }

        villes[villeId] = {
            nom: req.body.nom,
            description: req.body.description,
            image: req.body.image,
            histoire: req.body.histoire,
            actualites: [],
            sites: []
        };

        await writeVillesFile(villes);
        res.status(201).json(villes[villeId]);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de la ville' });
    }
});

// Ajouter un site touristique à une ville
router.post('/villes/:id/sites', async (req, res) => {
    try {
        const villes = await readVillesFile();
        const { id } = req.params;

        if (!villes[id]) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }

        const newSite = {
            id: uuidv4(),
            nom: req.body.nom,
            description: req.body.description,
            image: req.body.image,
            horaires: req.body.horaires,
            tarifs: req.body.tarifs
        };

        villes[id].sites.push(newSite);
        await writeVillesFile(villes);
        res.status(201).json(newSite);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout du site' });
    }
});

// Ajouter une actualité à une ville
router.post('/villes/:id/actualites', async (req, res) => {
    try {
        const villes = await readVillesFile();
        const { id } = req.params;

        if (!villes[id]) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }

        const newActu = {
            id: uuidv4(),
            titre: req.body.titre,
            date: req.body.date,
            contenu: req.body.contenu,
            image: req.body.image
        };

        villes[id].actualites.push(newActu);
        await writeVillesFile(villes);
        res.status(201).json(newActu);
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de l\'ajout de l\'actualité' });
    }
});

// Supprimer une ville
router.delete('/villes/:id', async (req, res) => {
    try {
        const villes = await readVillesFile();
        const { id } = req.params;

        if (!villes[id]) {
            return res.status(404).json({ error: 'Ville non trouvée' });
        }

        delete villes[id];
        await writeVillesFile(villes);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de la ville' });
    }
});

export default router;
