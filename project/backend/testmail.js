// test-mail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: 'killian.ngog@gmail.com',
  subject: 'Test Nodemailer',
  text: 'Ceci est un test.',
}, (err, info) => {
  if (err) {
    console.error('Erreur:', err);
  } else {
    console.log('Envoyé:', info.response);
  }
});