import { Router } from 'express';
import { discoverUsers } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/discover', discoverUsers);

export default router;
