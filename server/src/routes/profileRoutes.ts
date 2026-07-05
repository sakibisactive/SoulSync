import { Router } from 'express';
import {
  updateProfile,
  submitPersonalityAnswers,
  updateInterests,
  updatePreferences,
  addPhoto,
  getProfileByUserId,
} from '../controllers/profileController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(protect);

router.put('/me', updateProfile);
router.put('/personality', submitPersonalityAnswers);
router.put('/interests', updateInterests);
router.put('/preferences', updatePreferences);
router.post('/photos', addPhoto);
router.get('/user/:userId', getProfileByUserId);

export default router;
