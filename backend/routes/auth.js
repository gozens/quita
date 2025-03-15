import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const router = express.Router();

// Clé secrète pour JWT - à mettre dans un fichier .env en production
const JWT_SECRET = 'votre_clé_secrète';

// Utilisateur admin par défaut - à stocker dans une base de données en production
const ADMIN_USER = {
    username: 'admin',
    // Mot de passe hashé : 'admin123'
    password: '$2b$10$X7RYf6SZn.KL.WyV0LF5D.n.KQI6h5kQY6RZ6qGH5kQY6RZ6qGH5k'
};

// Route de connexion
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     try {
//         // Vérifier si l'utilisateur existe
//         if (username !== ADMIN_USER.username) {
//             return res.status(401).json({ error: 'Identifiants incorrects' });
//         }
        
//         // Vérifier le mot de passe
//         const validPassword = await bcrypt.compare(password, ADMIN_USER.password);
//         // const validPassword = true;
//         // return res.json({validPassword});
//         if (!validPassword) {
//             return res.status(401).json({ error: 'Identifiants incorrects' });
//         }

//         // Générer le token JWT
//         const token = jwt.sign(
//             { username: ADMIN_USER.username },
//             JWT_SECRET,
//             { expiresIn: '24h' }
//         );

//         res.json({ token });
//     } catch (error) {
//         console.error('Erreur lors de la connexion:', error);
//         res.status(500).json({ error: 'Erreur lors de la connexion' });
//     }
// });

router.post('/login', async (req, res) => {

    const { username, password } = req.body;
    try {
        // Vérifier si l'utilisateur existe
        if (username !== ADMIN_USER.username) {
            return res.status(401).json({ error: 'Identifiants incorrects' });
        }
        
        // Vérifier le mot de passe
        // const validPassword = await bcrypt.compare(password, ADMIN_USER.password);
        // if (!validPassword) {
        //     return res.status(401).json({ error: 'Identifiants incorrects' });
        // }

        // Générer le token JWT
        const token = jwt.sign(
            { username: ADMIN_USER.username },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Envoyer le token dans un cookie
        res.cookie('auth_token', token, {
            httpOnly: true,  // Le cookie est uniquement accessible via HTTP (sécurise le cookie contre l'accès via JavaScript)
            secure: process.env.NODE_ENV === 'production',  // Assurez-vous que ce cookie est seulement envoyé via HTTPS en production
            maxAge: 24 * 60 * 60 * 1000,  // Durée de vie du cookie (ici 24 heures)
            sameSite: 'Strict',  // Empêche les attaques CSRF
        });

        return res.json({ message: 'Authentification réussie' });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

router.get("/check", async(req, res)=>{
    //l'api renvoie des credentials comment les utiliser dans cette route
    const token = req.cookies.auth_token;
    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé' });
    }
    try {
        // const decoded = jwt.verify(token, JWT_SECRET);
        // req.user = decoded;
        req.user = { username: ADMIN_USER.username };
        return res.json({ message: 'Token valide' });
    } catch (error) {
        return res.status(401).json({ error: 'Token invalide', token: token });
    }
});


// Middleware pour vérifier le token JWT
export const verifyToken = (req, res, next) => {
    // const token = req.cookies.adminToken;
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ error: 'Accès non autorisé' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token invalide' });
    }
};

export const authRouter = router;
