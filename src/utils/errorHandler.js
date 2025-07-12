/** @format */

import AppError from './AppError.js';
import logger from './logger.js';

// Handle 404 Not Found - call this with app.all('*', handleNotFound)
export const handleNotFound = (req, res, next) => {
  next(new AppError(`Route ${req.originalUrl} not found on this server!`, 404));
};

// Handle MongoDB duplicate key errors
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: "${value}" for field "${field}". Please use another value!`;
  return new AppError(message, 400);
};

// Handle MongoDB validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

// Development error response
const sendErrorDev = (err, res) => {
  logger.error('Error 💥', {
    error: err,
    stack: err.stack,
    path: err.path,
    value: err.value,
    code: err.code,
  });

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// Production error response
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.warn('Operational Error', {
      statusCode: err.statusCode,
      status: err.status,
      message: err.message,
    });

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  // Programming or other unknown error: don't leak error details
  else {
    // Log error for debugging
    logger.error('Programming Error 💥', {
      error: err,
      stack: err.stack,
      path: err.path,
      value: err.value,
      code: err.code,
    });

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

// Global error handling middleware with integrated 404 logic
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log the request details
  logger.info('Request Details', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });

  // Handle 404 errors specifically
  if (err.statusCode === 404) {
    logger.warn('404 Not Found', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
