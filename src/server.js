/** @format */

import app from './app.js';
import logger from './utils/logger.js';
import mongoose from 'mongoose';

const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () =>
      logger.info(`🛫 PayFlow server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error('MongoDB connection error:', err));
