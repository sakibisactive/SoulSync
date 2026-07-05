import { Router } from 'express';
import { likeUser, saveUser, getMyLikes, deleteLike } from '../controllers/likeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.post('/', likeUser);
router.post('/save', saveUser);
router.get('/', getMyLikes);
router.delete('/:id', deleteLike);

export default router;
