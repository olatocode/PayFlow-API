/** @format */

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const authRoute = require('./src/routes/authRoute');

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.status(200).json({ data: 'Welcome To PayFlow API!' });
});

app.use('/api/v1/users', authRoute);

module.exports = app;
