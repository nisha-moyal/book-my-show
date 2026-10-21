import {Router} from 'express';
import { register, login, currentUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();


router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, currentUser);

export default router;