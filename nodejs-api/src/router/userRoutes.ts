import { Router } from 'express';
import UserController from '../controllers/UserController';
import { asyncHandler } from '../middlewares/asyncHandler';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

router.post('/register' ,asyncHandler(UserController.register));
  
router.post('/login', asyncHandler(UserController.login));

router.delete('/delete', authenticateToken, asyncHandler(UserController.deleteAccount));

router.put('/edit', authenticateToken, asyncHandler(UserController.editAccount));


export default router;