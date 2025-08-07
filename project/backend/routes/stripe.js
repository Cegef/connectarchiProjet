const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);


router.post('/create-checkout-session', async (req, res) => {
  const { userId } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1RqUYDR0EdwQmwWj57CfZys2', // Price ID Stripe
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId,
        role: 'entreprise',
      },
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      expand: ['subscription'],
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de la création de la session Stripe' });
  }
});

router.post('/create-customer-portal-session', async (req, res) => {
  const { customerId } = req.body;

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.FRONTEND_URL + '/profile',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Erreur création customer portal :', error);
    res.status(500).json({ error: 'Erreur création customer portal' });
  }
});

module.exports = router;