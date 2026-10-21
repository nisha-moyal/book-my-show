import {Router} from 'express';
import {aboutController} from '../controllers/aboutController.js';
const router = Router();

router.get('/', aboutController.getAbout);

export default router;