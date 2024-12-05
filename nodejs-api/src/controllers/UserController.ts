import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { User } from '../entities/User';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    const { name, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    if (password.length < 7) {
      res.status(400).json({ error: 'Password must be at least 7 characters.' });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = userRepository.create({ name, email, password: hashedPassword });
      await userRepository.save(user);

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
      });

      res.status(201).json({
        message: 'User registered successfully',
        token,
      });
    } catch (error) {
      res.status(400).json({ error: 'Registration failed', details: error });
    }
  }


  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

      res.json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ error: 'Login failed', details: error });
    }
  }

  async deleteAccount(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.id;
    const userRepository = AppDataSource.getRepository(User);
  
    try {
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      await userRepository.remove(user);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete account', details: error });
    }
  }

  async editAccount(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.id;
    const { email, currentPassword, newPassword } = req.body;
    const userRepository = AppDataSource.getRepository(User);
  
    try {
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
  
      if (email) {
        user.email = email;
      }
  
      if (currentPassword && newPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          res.status(401).json({ error: 'Current password is incorrect' });
          return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
      }
  
      await userRepository.save(user);
      res.json({ message: 'Account updated successfully' });
    } catch (error) {
      res.status(400).json({ error: 'Failed to update account', details: error });
    }
  }
  
  
  
}

export default new UserController();
