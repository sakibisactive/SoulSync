import { Router } from 'express';
import { computeMatches, getMatchById } from '../controllers/matchController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', computeMatches);
router.post('/compute', computeMatches);
router.get('/:targetUserId', getMatchById);

export default router;
