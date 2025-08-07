// routes/webhook.js
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../db'); // doit être mysql2/promise avec createPool

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('⚠️  Webhook signature failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const userId = session.metadata.userId;
    const subscriptionId = session.subscription;
    const customerId = session.customer;

    if (!subscriptionId) {
      console.error('❌ Subscription ID manquant dans la session');
      return res.status(400).send("Abonnement non détecté");
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const periodEnd = new Date(subscription.current_period_end * 1000);

      const sql = `
        UPDATE entreprises
        SET is_subscribed = TRUE,
            subscription_end = ?,
            stripe_customer_id = ?
        WHERE user_id = ?
      `;

      const [result] = await db.query(sql, [periodEnd, customerId, userId]);

      console.log(`✅ Abonnement activé jusqu’au ${periodEnd} pour user ${userId} (${result.affectedRows} lignes modifiées)`);
    } catch (err) {
      console.error('❌ Erreur récupération abonnement :', err);
      return res.status(500).send("Erreur lors de la récupération de l'abonnement");
    }
  }

  res.json({ received: true });
});

module.exports = router;
