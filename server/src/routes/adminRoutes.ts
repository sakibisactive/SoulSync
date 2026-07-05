import { Router } from 'express';
import {
  getAllUsers,
  banUser,
  verifyUser,
  deleteUser,
  getReports,
  resolveReport,
  createInterest,
  deleteInterest,
  getAdminAnalytics,
} from '../controllers/adminController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { restrictTo } from '../middlewares/roleMiddleware.js';

const router = Router();

router.use(protect);
router.use(restrictTo('Admin'));

router.get('/users', getAllUsers);
router.patch('/ban/:id', banUser);
router.patch('/verify/:id', verifyUser);
router.delete('/user/:id', deleteUser);

router.get('/reports', getReports);
router.patch('/reports/:reportId', resolveReport);

router.post('/interests', createInterest);
router.delete('/interests/:id', deleteInterest);

router.get('/analytics', getAdminAnalytics);

export default router;
