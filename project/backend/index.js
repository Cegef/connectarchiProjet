const express = require('express');
const cors = require('cors');
const db = require('./db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Exemple de route GET
app.get('/api/utilisateurs', (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

app.get('/api/companies', (req, res) => {
  const sql = 'SELECT * FROM entreprises';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des entreprises :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

app.get('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM entreprises WHERE id = ? LIMIT 1';
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'entreprise :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    res.json(results[0]);
  });
});

// Récupérer tous les freelances
app.get('/api/freelancers', (req, res) => {
  const sql = `
    SELECT f.*, u.username, u.email
    FROM freelances f
    JOIN users u ON f.user_id = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des freelances :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    // Parse skills et portfolio si besoin
    const parsed = results.map(freelancer => {
      let skills = freelancer.skills;
      let portfolio = freelancer.portfolio;
      try {
        if (typeof skills === 'string' && skills.startsWith('[')) {
          skills = JSON.parse(skills);
        }
      } catch {}
      try {
        if (typeof portfolio === 'string' && portfolio.startsWith('[')) {
          portfolio = JSON.parse(portfolio);
        }
      } catch {}
      return { ...freelancer, skills, portfolio };
    });
    res.json(parsed);
  });
});

app.get('/api/freelancers/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT f.*, u.username, u.email
    FROM freelances f
    JOIN users u ON f.user_id = u.id
    WHERE f.id = ?
  `;
  db.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    if (!results.length) return res.status(404).json({ error: 'Not found' });
    const freelancer = results[0];
    if (freelancer.skills && typeof freelancer.skills === 'string') {
      try { freelancer.skills = JSON.parse(freelancer.skills); } catch {}
    }
    if (freelancer.portfolio && typeof freelancer.portfolio === 'string') {
      try { freelancer.portfolio = JSON.parse(freelancer.portfolio); } catch {}
    }
    res.json(freelancer);
  });
});

// Route POST pour la connexion
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Vérifier si l'utilisateur existe dans la base de données
  const sql = `SELECT id, username, email, role FROM users WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Connexion réussie',
      user,
      token,
    });
  });
});

// Route POST pour créer un utilisateur
app.post('/api/users', (req, res) => {
  const { username, email, password, role } = req.body;

  const sql = `
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [username, email, password, role], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion dans la table users :', err);
      return res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: result.insertId, username, role }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      id: result.insertId,
      token
    });
  });
});

// Route POST pour sauvegarder un profil freelance
app.post('/api/freelances', (req, res) => {
  const {
    user_id, // ID de l'utilisateur associé
    title,
    specialization,
    location,
    hourlyRate,
    description,
    skills,
    availability,
    experienceYears,
    avatar,
    portfolio
  } = req.body;

  const sql = `
    INSERT INTO freelances (
      user_id, title, specialization, location, hourly_rate, description, skills, availability, experience_years, avatar, portfolio
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      title,
      specialization,
      location,
      hourlyRate,
      description,
      skills,
      availability,
      experienceYears,
      avatar,
      JSON.stringify(portfolio) // Convertit le portfolio en JSON pour le stockage
    ],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans la table freelances :', err);
        return res.status(500).json({ error: 'Erreur lors de la sauvegarde du profil freelance' });
      }
      res.status(201).json({ message: 'Profil freelance sauvegardé avec succès', id: result.insertId });
    }
  );
});

app.post('/api/companies', (req, res) => {
  const {
    user_id,
    name,
    siret,
    vatNumber,
    registrationCity,
    legalStatus,
    address,
    website,
    description,
    logo,
  } = req.body;

  const sql = `
    INSERT INTO entreprises (
      user_id, name, siret, vat_number, registration_city, legal_status, address, website, description, logo
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, name, siret, vatNumber, registrationCity, legalStatus, address, website, description, logo],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans la table entreprises :', err);
        return res.status(500).json({ error: 'Erreur lors de la création du profil entreprise' });
      }
      res.status(201).json({ message: 'Profil entreprise créé avec succès', id: result.insertId });
    }
  );
});

// Récupérer un profil freelance par user_id
app.get('/api/freelancers/by-user/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM freelances WHERE user_id = ? LIMIT 1';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du freelance :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Freelance non trouvé' });
    }
    // Si skills ou portfolio sont stockés en JSON, les parser ici
    const freelance = results[0];
    if (freelance.skills && typeof freelance.skills === 'string') {
      try { freelance.skills = JSON.parse(freelance.skills); } catch {}
    }
    if (freelance.portfolio && typeof freelance.portfolio === 'string') {
      try { freelance.portfolio = JSON.parse(freelance.portfolio); } catch {}
    }
    res.json(freelance);
  });
});

// Récupérer un profil entreprise par user_id
app.get('/api/companies/by-user/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = 'SELECT * FROM entreprises WHERE user_id = ? LIMIT 1';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération de l\'entreprise :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Entreprise non trouvée' });
    }
    res.json(results[0]);
  });
});

// Mettre à jour un freelance par user_id
app.put('/api/freelancers/by-user/:userId', (req, res) => {
  const { userId } = req.params;
  const {
    title, specialization, location, hourlyRate, description,
    skills, availability, experienceYears, avatar, portfolio
  } = req.body;

  const sql = `
    UPDATE freelances SET
      title = ?, specialization = ?, location = ?, hourlyRate = ?, description = ?,
      skills = ?, availability = ?, experienceYears = ?, avatar = ?, portfolio = ?
    WHERE user_id = ?
  `;
  db.query(sql, [
    title, specialization, location, hourlyRate, description,
    JSON.stringify(skills), availability, experienceYears, avatar, JSON.stringify(portfolio),
    userId
  ], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour du freelance :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ message: 'Freelance mis à jour' });
  });
});

// Mettre à jour une entreprise par user_id
app.put('/api/companies/by-user/:userId', (req, res) => {
  const { userId } = req.params;
  const {
    name, siret, vatNumber, registrationCity, legalStatus,
    address, website, description, logo
  } = req.body;

  const sql = `
    UPDATE entreprises SET
      name = ?, siret = ?, vatNumber = ?, registrationCity = ?, legalStatus = ?,
      address = ?, website = ?, description = ?, logo = ?
    WHERE user_id = ?
  `;
  db.query(sql, [
    name, siret, vatNumber, registrationCity, legalStatus,
    address, website, description, logo,
    userId
  ], (err, result) => {
    if (err) {
      console.error('Erreur lors de la mise à jour de l\'entreprise :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ message: 'Entreprise mise à jour' });
  });
});

app.post('/api/appels-doffre', (req, res) => {
  const {
    entreprise_id,
    titre,
    description,
    budget,
    deadline,
    duree,
    lieu,
    remote
  } = req.body;

  const sql = `
    INSERT INTO appel_doffre (entreprise_id, titre, description, budget, deadline, duree, lieu, remote)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [entreprise_id, titre, description, budget, deadline, duree, lieu, remote],
    (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'insertion dans appel_doffre :', err);
        return res.status(500).json({ error: 'Erreur lors de la création de l\'appel d\'offre' });
      }
      res.status(201).json({ message: 'Appel d\'offre créé', id: result.insertId });
    }
  );
});

app.get('/api/appels-doffre', (req, res) => {
  const sql = `
    SELECT a.*, e.name AS entreprise_name
    FROM appel_doffre a
    JOIN entreprises e ON a.entreprise_id = e.id
    ORDER BY a.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des appels d\'offre :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

// Ajouter une candidature à une offre d'emploi
app.post('/api/applications', (req, res) => {
  const { jobId, freelancerId, coverLetter, proposedRate } = req.body;
  if (!jobId || !freelancerId || !coverLetter || !proposedRate) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  const sql = `
    INSERT INTO applications (job_id, freelancer_id, coverLetter, proposedRate, createdAt)
    VALUES (?, ?, ?, ?, NOW())
  `;
  db.query(sql, [jobId, freelancerId, coverLetter, proposedRate], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'insertion de la candidature :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({ success: true, id: result.insertId });
  });
});

app.post('/api/messages', (req, res) => {
  const { senderId, receiverId, subject, content } = req.body;
  console.log('POST /api/messages', { senderId, receiverId, subject, content });
  if (!senderId || !receiverId || !subject || !content) {
    return res.status(400).json({ error: 'Champs manquants' });
  }
  // 1. Vérifier si une conversation existe déjà entre ces deux utilisateurs
  const sqlFind = `
    SELECT id FROM conversations
    WHERE (user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?)
    LIMIT 1
  `;
  db.query(sqlFind, [senderId, receiverId, receiverId, senderId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    let conversationId;
    if (results.length > 0) {
      conversationId = results[0].id;
      insertMessage(conversationId);
    } else {
      // Créer la conversation
      const sqlCreate = `
        INSERT INTO conversations (user1_id, user2_id)
        VALUES (?, ?)
      `;
      db.query(sqlCreate, [senderId, receiverId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        conversationId = result.insertId;
        insertMessage(conversationId);
      });
    }
    function insertMessage(conversationId) {
      const sqlMsg = `
        INSERT INTO messages (conversation_id, sender_id, subject, content, created_at)
        VALUES (?, ?, ?, ?, NOW())
      `;
      db.query(sqlMsg, [conversationId, senderId, subject, content], (err, result) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        res.status(201).json({ success: true, conversationId, messageId: result.insertId });
      });
    }
  });
});

app.post('/api/conversations', (req, res) => {
  const { user1_id, user2_id, job_id, title } = req.body;
  const sql = `
    INSERT INTO conversations (user1_id, user2_id, job_id, title)
    VALUES (?, ?, ?, ?)
  `;
  db.query(sql, [user1_id, user2_id, job_id || null, title || null], (err, result) => {
    if (err) {
      console.error('Erreur lors de la création de la conversation :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({ id: result.insertId, user1_id, user2_id, job_id, title });
  });
});

// Envoyer un message dans une conversation
app.post('/api/messages/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const { senderId, content } = req.body;
  console.log('POST /api/messages/:conversationId', { conversationId, senderId, content });
  const sql = `
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [conversationId, senderId, content], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'envoi du message :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({
      id: result.insertId,
      conversation_id: conversationId,
      senderId,
      content,
      created_at: new Date()
    });
  });
});

// Lister les conversations d'un utilisateur
app.get('/api/conversations/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT c.*, 
      u1.username AS user1_name, 
      u2.username AS user2_name
    FROM conversations c
    JOIN users u1 ON c.user1_id = u1.id
    JOIN users u2 ON c.user2_id = u2.id
    WHERE c.user1_id = ? OR c.user2_id = ?
    ORDER BY c.id DESC
  `;
  db.query(sql, [userId, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

// Récupérer les messages d'une conversation
app.get('/api/messages/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const sql = `
    SELECT * FROM messages
    WHERE conversation_id = ?
    ORDER BY created_at ASC
  `;
  db.query(sql, [conversationId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des messages :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

app.get('/api/applications/by-company/:userId', (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT a.*, u.username AS freelancer_name, j.titre AS job_title, f.user_id AS freelancer_user_id
    FROM applications a
    JOIN appel_doffre j ON a.job_id = j.id
    JOIN freelances f ON a.freelancer_id = f.id
    JOIN users u ON f.user_id = u.id
    WHERE j.entreprise_id IN (
      SELECT id FROM entreprises WHERE user_id = ?
    )
    ORDER BY a.createdAt DESC
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur' });
    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});