import 'reflect-metadata';
import express from 'express';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import userRoutes from './router/userRoutes';
import productRoutes from './router/productRoutes';
import { User } from './entities/User';
import { Product } from './entities/Product';
import cors from 'cors';
import * as fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 2005;

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

app.use(cors());

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));



export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'project_web',
  synchronize: true,
  logging: false,
  entities: [User, Product],
});

AppDataSource.initialize()
  .then(() => {

    console.log('Database connected');

    app.use(express.json());

    app.use('/users', userRoutes);
    app.use('/products', productRoutes);

    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

    app.use((req, res, next) => {
      next();
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => console.error('Database connection failed:', error));
