
// src/utils/logger.js
const winston = require('winston');
require('winston-daily-rotate-file');
const path = require('path');

const logDir = path.join(__dirname, '../../logs');

const transport = new winston.transports.DailyRotateFile({
  filename: `${logDir}/app-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d'
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`)
  ),
  transports: [transport, new winston.transports.Console()]
});

module.exports = logger;