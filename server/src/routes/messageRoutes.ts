import { Router } from 'express';
import { getChats, getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/chats', getChats);
router.get('/:chatId', getMessages);
router.post('/', sendMessage);

export default router;
