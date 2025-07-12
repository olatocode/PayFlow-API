/** @format */

import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize, json } = format;

// Define your custom format
const myFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(timestamp(), json()),
  transports: [
    new transports.Console({
      format: combine(colorize(), myFormat),
    }),
    new transports.File({ filename: 'log/app.log' }),
  ],
});

export default logger;
