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
    hourly_rate,
    description,
    skills,
    availability,
    experience_years,
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
      hourly_rate,
      description,
      skills,
      availability,
      experience_years,
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

app.listen(PORT, () => {
  console.log(`🚀 Serveur backend lancé sur http://localhost:${PORT}`);
});