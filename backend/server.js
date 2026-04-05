const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-jobshift';

// Initialisation de la base de données SQLite
const dbPath = path.join(__dirname, 'jobshift.db');
const db = new Database(dbPath);

// Création des tables si elles n'existent pas
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'RECRUITER'
    );
    CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        status TEXT NOT NULL,
        user_id TEXT,
        released_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
`);

// Middleware pour vérifier le JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Route Login pour Recruteurs
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Pour le MVP, on crée un compte auto si la base est vide
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        db.prepare('INSERT INTO users (email, password) VALUES (?, ?)').run('admin@jobshift.com', hashedPassword);
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(400).json({ error: "Utilisateur non trouvé" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*", methods: ["GET", "POST"] }
});

// Endpoint pour déclarer un changement de poste
app.post('/api/release-job', (req, res) => {
    const { userId, newTitle, newCompany, oldJobTitle, oldCompany } = req.body;
    
    console.log(`[RECU] Tentative de libération : ${oldJobTitle} chez ${oldCompany}`);

    try {
        // 1. Sauvegarder l'ancien poste libéré en base de données
        const insert = db.prepare('INSERT INTO jobs (title, company, status, user_id) VALUES (?, ?, ?, ?)');
        const result = insert.run(oldJobTitle, oldCompany, 'RELEASED', userId || 'Utilisateur Réel');

        const notification = {
            id: result.lastInsertRowid,
            title: oldJobTitle,
            company: oldCompany,
            message: `ALERTE : Poste de ${oldJobTitle} libéré chez ${oldCompany} !`,
            timestamp: new Date(),
            isCritical: oldJobTitle.toLowerCase().includes('senior') || oldJobTitle.toLowerCase().includes('lead') || oldJobTitle.toLowerCase().includes('engineer')
        };

        // 2. Notification en temps réel
        io.emit('job_released', notification);

        // 3. Sauvegarder aussi le nouveau poste (actif)
        insert.run(newTitle, newCompany, 'ACTIVE', userId || 'Utilisateur Réel');

        console.log(`[SUCCÈS] Base de données mise à jour et notification envoyée.`);
        return res.status(200).json({ success: true, jobId: result.lastInsertRowid });
    } catch (err) {
        console.error("Erreur DB:", err);
        res.status(500).json({ error: "Erreur serveur lors de l'enregistrement." });
    }
});

// API pour récupérer l'historique des postes libérés (PROTEGÉE)
app.get('/api/released-jobs', authenticateToken, (req, res) => {
    const jobs = db.prepare('SELECT * FROM jobs WHERE status = "RELEASED" ORDER BY released_at DESC').all();
    // On adapte le format pour le frontend (released_at -> timestamp)
    const formatted = jobs.map(j => ({
        ...j,
        timestamp: j.released_at
    }));
    res.json(formatted);
});

// NOUVELLE ROUTE : IA Auto-Detection (Simulation)
app.post('/api/ia-analyze', async (req, res) => {
    const { text } = req.body;
    console.log(`[IA] Analyse du texte : ${text.substring(0, 50)}...`);

    // Simulation d'une réponse IA (On pourrait appeler OpenAI ici)
    // On attend 1.5s pour faire "pro"
    await new Promise(r => setTimeout(r, 1500));

    // Logique simplifiée pour la démo
    const response = {
        oldJobTitle: "Data Engineer",
        oldCompany: "Ancienne Boîte SAS",
        newTitle: "AI Solution Architect",
        newCompany: "Future AI Lab"
    };

    res.json(response);
});

io.on('connection', (socket) => {
    console.log('Recruteur connecté:', socket.id);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Serveur JobShiftTracker prêt (SQLite) sur le port ${PORT}`);
});
