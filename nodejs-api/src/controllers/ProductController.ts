import { Request, Response } from 'express';
import { AppDataSource } from '../index';
import { Product } from '../entities/Product';
import fs from 'fs';
import path from 'path';

class ProductController {
  async create(req: Request, res: Response): Promise<void> {
    const { name } = req.body;
    const userId = (req as any).user.id;
    const productRepository = AppDataSource.getRepository(Product);
  
    try {
      let imageUrl = null;
  
      if (req.file) {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        const filename = `${Date.now()}-${req.file.originalname}`;
  
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
  
        fs.writeFileSync(path.join(uploadPath, filename), req.file.buffer);
  
        imageUrl = `uploads/${filename}`;
      }
  
      const product = productRepository.create({
        name,
        imageUrl,
        userId,
      });
  
      await productRepository.save(product);
  
      res.status(201).json(product);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: 'Failed to create product', details: error });
    }
  }
  
  

  async read(req: Request, res: Response): Promise<void> {
    const userId = (req as any).user.id;
    const productRepository = AppDataSource.getRepository(Product);

    try {
      const products = await productRepository.find({ where: { userId } });
      res.json(products);
    } catch (error) {
      res.status(400).json({ error: 'Failed to fetch products', details: error });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = (req as any).user.id;


    console.log(req.file);
  
    const productRepository = AppDataSource.getRepository(Product);
  
    try {
      const product = await productRepository.findOne({ where: { id: parseInt(id), userId } });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
  
      product.name = req.body.name || product.name;
  
      if (req.file) {
        const uploadPath = path.join(__dirname, '..', 'uploads');
        const filename = `${Date.now()}-${req.file.originalname}`;
  
        if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
        }
  
        fs.writeFileSync(path.join(uploadPath, filename), req.file.buffer);
  
        product.imageUrl = `uploads/${filename}`;
      }
  
      await productRepository.save(product);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: 'Failed to update product', details: error });
    }
  }
  

  async delete(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = (req as any).user.id;
    const productRepository = AppDataSource.getRepository(Product);

    try {
      const product = await productRepository.findOne({ where: { id: parseInt(id), userId } });
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }

      await productRepository.remove(product);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: 'Failed to delete product', details: error });
    }
  }
}

export default new ProductController();
