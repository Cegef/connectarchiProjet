const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const db = require('./db');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configuration de multer pour l'upload d'images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../client/public/uploads/avatars'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const logoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../client/public/uploads/logos');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

const uploadLogo = multer({ 
  storage: logoStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
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

const transporter = nodemailer.createTransport({
  service: 'gmail', // ou autre
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post('/api/upload/avatar', upload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé' });
  // Retourne l’URL publique de l’image
  res.json({ url: `/uploads/avatars/${req.file.filename}` });
});

// Pour servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.post('/api/upload/logo', uploadLogo.single('logo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier envoyé' });
  }
  const logoUrl = `/uploads/logos/${req.file.filename}`;
  res.json({ url: logoUrl });
});

app.use('/uploads', express.static('uploads'));


const portfolioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../client/public/uploads/portfolio'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const uploadPortfolio = multer({ storage: portfolioStorage });

// Upload d'image de projet portfolio
app.post('/api/upload/portfolio', uploadPortfolio.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier envoyé' });
  res.json({ url: `/uploads/portfolio/${req.file.filename}` });
});

// Ajouter un projet ou un lien au portfolio
app.post('/api/portfolio', (req, res) => {
  const { freelance_id, title, description, image, url } = req.body;
  const sql = `
    INSERT INTO portfolio (freelance_id, title, description, image, url)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [freelance_id, title, description, image, url], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'ajout au portfolio :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Projet ajouté au portfolio', id: result.insertId });
  });
});

// Récupérer le portfolio d'un freelance
app.get('/api/portfolio/:freelanceId', (req, res) => {
  const { freelanceId } = req.params;
  const sql = `SELECT * FROM portfolio WHERE freelance_id = ? ORDER BY created_at DESC`;
  db.query(sql, [freelanceId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du portfolio :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
});

// Supprimer un projet du portfolio
app.delete('/api/portfolio/:id', (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM portfolio WHERE id = ?`;
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression du projet :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ message: 'Projet supprimé' });
  });
});

app.get('/api/portfolio/item/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM portfolio WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ error: 'Projet non trouvé' });
    res.json(results[0]);
  });
});

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
  const sql = `SELECT id, username, email, password, role FROM users WHERE email = ?`;
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Erreur lors de la vérification de l\'utilisateur :', err);
      return res.status(500).json({ error: 'Erreur interne du serveur' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = results[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    delete user.password;

    res.status(200).json({
      message: 'Connexion réussie',
      user,
      token,
    });
  });
});

// Route POST pour créer un utilisateur
app.post('/api/users', async (req, res) => {
  const { username, email, password, role } = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const sql = `
    INSERT INTO users (username, email, password, role)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [username, email, hashedPassword, role], (err, result) => {
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
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // 2. Récupérer l'email de l'entreprise liée à l'appel d'offre
    const sqlEntrepriseUser = `
      SELECT u.email, a.titre
      FROM appel_doffre a
      JOIN entreprises e ON a.entreprise_id = e.id
      JOIN users u ON e.user_id = u.id
      WHERE a.id = ?
      LIMIT 1
    `;

    db.query(sqlEntrepriseUser, [jobId], (err2, userResults) => {
      if (!err2 && userResults.length > 0) {
        const recipientEmail = userResults[0].email;
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: recipientEmail,
          subject: 'Nouvelle candidature reçue',
          text: `Vous avez reçu une nouvelle candidature pour l'appel d'offre : ${userResults[0].titre}`,
        }, (mailErr, info) => {
          if (mailErr) {
            console.error('Erreur lors de l\'envoi de l\'email :', mailErr);
          }
        });
      }
      res.status(201).json({ success: true, id: result.insertId });
    });
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
        INSERT INTO conversations (user1_id, user2_id, title)
        VALUES (?, ?, ?)
      `;
      db.query(sqlCreate, [senderId, receiverId, subject], (err, result) => {
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

        // ENVOI EMAIL AU RECEIVER
        const sqlUser = `SELECT email FROM users WHERE id = ? LIMIT 1`;
        db.query(sqlUser, [receiverId], (err2, userResults) => {
          if (!err2 && userResults.length > 0) {
            const recipientEmail = userResults[0].email;
            transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: recipientEmail,
              subject: 'Nouveau message reçu',
              text: `Vous avez reçu un nouveau message sur Bimply, \n\nSujet : ${subject}`,
            }, (mailErr, info) => {
              if (mailErr) {
                console.error('Erreur lors de l\'envoi de l\'email :', mailErr);
              }
            });
          }
          res.status(201).json({ success: true, conversationId, messageId: result.insertId });
        });
      });
    }
  });
});

app.post('/api/conversations', (req, res) => {
  const { user1_id, user2_id, job_id, title } = req.body;

  // 1. Vérifier si la conversation existe déjà
  const sqlFind = `
    SELECT id FROM conversations
    WHERE ((user1_id = ? AND user2_id = ?) OR (user1_id = ? AND user2_id = ?))
      AND job_id = ?
    LIMIT 1
  `;
  db.query(sqlFind, [user1_id, user2_id, user2_id, user1_id, job_id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la recherche de la conversation :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length > 0) {
      // Conversation déjà existante
      return res.status(200).json({ id: results[0].id, user1_id, user2_id, job_id, title });
    }
    // 2. Sinon, créer la conversation
    const sqlCreate = `
      INSERT INTO conversations (user1_id, user2_id, job_id, title)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sqlCreate, [user1_id, user2_id, job_id || null, title || null], (err2, result) => {
      if (err2) {
        console.error('Erreur lors de la création de la conversation :', err2);
        return res.status(500).json({ error: 'Erreur serveur' });
      }
      res.status(201).json({ id: result.insertId, user1_id, user2_id, job_id, title });
    });
  });
});

// Envoyer un message dans une conversation
app.post('/api/messages/:conversationId', (req, res) => {
  const { conversationId } = req.params;
  const { senderId, content } = req.body;
  console.log('POST /api/messages/:conversationId', { conversationId, senderId, content });

  // 1. Insérer le message
  const sql = `
    INSERT INTO messages (conversation_id, sender_id, content)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [conversationId, senderId, content], (err, result) => {
    if (err) {
      console.error('Erreur lors de l\'envoi du message :', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    // 2. Récupérer l'id du destinataire dans la conversation
    const sqlConv = `
      SELECT user1_id, user2_id FROM conversations WHERE id = ?
    `;
    db.query(sqlConv, [conversationId], (err2, convResults) => {
      if (err2 || convResults.length === 0) {
        console.error('Erreur lors de la récupération de la conversation :', err2);
        // On retourne quand même le message même si l'email échoue
        return res.status(201).json({
          id: result.insertId,
          conversation_id: conversationId,
          senderId,
          content,
          created_at: new Date()
        });
      }

      const conv = convResults[0];
      // Le destinataire est l'autre utilisateur de la conversation
      const recipientId = (conv.user1_id === senderId) ? conv.user2_id : conv.user1_id;

      // 3. Récupérer l'email du destinataire
      const sqlUser = `SELECT email FROM users WHERE id = ? LIMIT 1`;
      db.query(sqlUser, [recipientId], (err3, userResults) => {
        if (!err3 && userResults.length > 0) {
          const recipientEmail = userResults[0].email;

          // 4. Envoyer l'email de notification
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: 'Nouveau message reçu',
            text: `Vous avez reçu un nouveau message sur Bimply`,
          }, (mailErr, info) => {
            if (mailErr) {
              console.error('Erreur lors de l\'envoi de l\'email :', mailErr);
            }
          });
        }
        // On retourne la réponse même si l'email échoue
        res.status(201).json({
          id: result.insertId,
          conversation_id: conversationId,
          senderId,
          content,
          created_at: new Date()
        });
      });
    });
  });
});

// Lister les conversations d'un utilisateur
app.get('/api/conversations/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT 
      c.*,
      CASE 
        WHEN c.user1_id = ? THEN u2.username 
        ELSE u1.username 
      END AS other_username,
      CASE 
        WHEN c.user1_id = ? THEN (
          CASE 
            WHEN u2.role = 'freelance' THEN f2.avatar
            WHEN u2.role = 'entreprise' THEN e2.logo
          END
        )
        ELSE (
          CASE 
            WHEN u1.role = 'freelance' THEN f1.avatar
            WHEN u1.role = 'entreprise' THEN e1.logo
          END
        )
      END AS other_avatar,
      CASE 
        WHEN c.user1_id = ? THEN u2.role
        ELSE u1.role
      END AS other_role
    FROM conversations c
    JOIN users u1 ON c.user1_id = u1.id
    JOIN users u2 ON c.user2_id = u2.id
    LEFT JOIN freelances f1 ON u1.id = f1.user_id
    LEFT JOIN freelances f2 ON u2.id = f2.user_id
    LEFT JOIN entreprises e1 ON u1.id = e1.user_id
    LEFT JOIN entreprises e2 ON u2.id = e2.user_id
    WHERE c.user1_id = ? OR c.user2_id = ?
    ORDER BY c.created_at DESC
  `;
  
  db.query(sql, [userId, userId, userId, userId, userId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des conversations:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
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