require("dotenv").config();
const logger = require("./config/logger");
const { startExpressServer } = require("./server");
const { initializeWhatsAppBot } = require("./whatsapp");


// Require database
const mongoose = require("mongoose");

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    await initializeWhatsAppBot();
    startExpressServer();
  } catch (error) {
    logger.error("Failed to start application", {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
}).catch((err) => {
  logger.error("Database connection error", { 
    error: err.message, 
    stack: err.stack 
  });
}).finally(() => {
  logger.info("Database connection attempt completed");
});
