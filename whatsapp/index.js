const logger = require("../config/logger");
const { wpClient } = require("./client");

const initializeWhatsAppBot = async () => {
  try {
    await wpClient.initialize();
    logger.info("WhatsApp bot initialized successfully");
    return wpClient;
  } catch (error) {
    logger.error("Failed to initialize WhatsApp bot", {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = {
  initializeWhatsAppBot,
}; 