import dotenv from 'dotenv';
import Stripe from 'stripe';
import Show from '../models/show.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getStripeConfig = (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

export const createCheckoutSession = async (req, res) => {
  try {
    const { showId, seats } = req.body;

    if (!showId || !seats?.length) {
      return res.status(400).json({ message: 'Show and seats are required' });
    }

    const show = await Show.findById(showId).populate('movie');

    if (!show) {
      return res.status(404).json({ message: 'Show not found' });
    }

    const amount = show.ticketPrice * seats.length * 100; // Convert to paise

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded_page',
      redirect_on_completion: 'never',
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `${show.movie?.title || 'Movie'} Tickets`,
              description: `Seats: ${seats.join(', ')}`
            },
            unit_amount: show.ticketPrice * 100
          },
          quantity: seats.length
        }
      ]
    });
  
    res.status(200).json({
      sessionId: session.id,
      clientSecret: session.client_secret
    });
    
  } catch (error) {
    res.status(500).json({ message: 'Failed to create checkout session', error: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ message: 'session_id is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    const isPaid = session.status === 'complete' && session.payment_status === 'paid';

    res.status(200).json({
      paymentStatus: isPaid ? 'success' : 'failed',
      transactionId: isPaid ? session.payment_intent : null
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to verify payment',
      error: error.message
    });
  }
};

