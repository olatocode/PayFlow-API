/** @format */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoute from './routes/authRoute.js';
import userRoute from './routes/userRoute.js';
import walletRoute from './routes/walletRoute.js';
import transactionRoute from './routes/transactionRoute.js';
import { errorHandler, handleNotFound } from './utils/errorHandler.js';
import logger from './utils/logger.js';


const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }, { limit: '5mb' }));
app.use(helmet());
app.use(cors());

// HTTP request logging
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome To PayFlow API!' });
});

app.use('/api/v1/users', authRoute, userRoute);
app.use('/api/v1/wallets', walletRoute);
app.use('/api/v1/transactions', transactionRoute);

// Handle 404 for undefined routes
app.use(handleNotFound);

// Global error handling middleware
app.use(errorHandler);

export default app;
