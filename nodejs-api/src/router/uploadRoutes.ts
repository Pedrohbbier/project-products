import { Router } from 'express';
import upload from '../middlewares/upload';
import { asyncHandler } from '../middlewares/asyncHandler';

const router = Router();

router.post(
  '/',
  upload.single('file'),
  asyncHandler((req: any, res: any) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ fileUrl });
  })
);

export default router;
