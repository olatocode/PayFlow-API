/** @format */

const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`🛫 PayFlow running on port http://localhost:${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
