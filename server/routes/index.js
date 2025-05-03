const express = require('express');
const router = express.Router();

// Import route modules
const healthRoutes = require('./health');
const whatsappRoutes = require('./whatsapp');

// Mount routes
router.use('/health', healthRoutes);
router.use('/whatsapp', whatsappRoutes);

module.exports = router; 