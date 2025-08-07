const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const db = require('../db');

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// ENVOI DU CODE
router.post('/send', async (req, res) => {
  const { phoneNumber } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  try {
    await client.messages.create({
      body: `Votre code de vérification est : ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    await db.query(
      'INSERT INTO verifications (phone, code, expires_at) VALUES (?, ?, ?)',
      [phoneNumber, code, expiresAt]
    );

    res.json({ success: true, message: 'Code envoyé' });
  } catch (error) {
    console.error('❌ Erreur dans /verification/send :', error);
    res.status(500).json({ success: false, error: 'Erreur d’envoi du SMS' });
  }
});

// VÉRIFICATION DU CODE
router.post('/verify', async (req, res) => {
  const { phoneNumber, code } = req.body;

  const [rows] = await db.query(
    'SELECT * FROM verifications WHERE phone = ? AND code = ? AND expires_at > ?',
    [phoneNumber, code, Date.now()]
  );

  if (rows.length > 0) {
    await db.query('DELETE FROM verifications WHERE phone = ?', [phoneNumber]);
    res.json({ success: true, message: 'Vérification réussie' });
  } else {
    res.status(400).json({ success: false, error: 'Code invalide ou expiré' });
  }
});

module.exports = router;