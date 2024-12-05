import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: 'Token is missing' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    (req as any).user = { id: decoded.id };
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
}
