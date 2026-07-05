import { Router } from 'express';
import { getQuestions, getInterests } from '../controllers/questionController.js';

const router = Router();

router.get('/questions', getQuestions);
router.get('/interests', getInterests);

export default router;
