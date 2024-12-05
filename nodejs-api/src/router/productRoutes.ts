import { Router } from 'express';
import multer from 'multer';
import ProductController from '../controllers/ProductController';
import { authenticateToken } from '../middlewares/auth';
import { asyncHandler } from '../middlewares/asyncHandler';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post(
  '/',
  authenticateToken,
  upload.single('image'),
  asyncHandler(ProductController.create)
);

router.get('/', authenticateToken, asyncHandler(ProductController.read));
router.put('/:id', authenticateToken, upload.single('image'), asyncHandler(ProductController.update));
router.delete('/:id', authenticateToken, asyncHandler(ProductController.delete));

export default router;
