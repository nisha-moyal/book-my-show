import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { getStripeConfig, createCheckoutSession, verifyPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.get('/verify', authMiddleware, verifyPayment);


export default router;
