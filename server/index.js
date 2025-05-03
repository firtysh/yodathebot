const express = require('express');
const cors = require('cors');
const logger = require('../config/logger');
const router = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    body: req.body
  });
  next();
});

app.get('/', async (req, res) => {
  res.json({
    message: "👋 Hello there! I'm a WhatsApp bot, but I'm also a secret agent! 🕵️‍♂️",
    easterEgg: "Did you know? I can process messages faster than you can say 'WhatsApp'! But shhh... 🤫",
    funFact: "My code is written in JavaScript, but I dream in binary! 💭",
    secret: "If you find this message, you've discovered my secret identity! 🎉"
  });
});

// Mount API routes
app.use('/', router);


// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  logger.warn('Route not found', {
    path: req.path,
    method: req.method
  });
  
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

const PORT = process.env.PORT || 8001;

const startExpressServer = () => {
  app.listen(PORT, (error) => {
    if (error) {
      logger.error('Failed to start express server', {
        error: error.message,
        stack: error.stack
      });
      process.exit(1);
    }
    logger.info(`Express server listening on port ${PORT}`);
  });
};

module.exports = { app, startExpressServer }; 