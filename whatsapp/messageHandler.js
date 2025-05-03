const logger = require("../config/logger");
const { processMessage } = require("../bot/messageProcessor");

const setupMessageHandling = (client) => {
  client.on("message", async (message) => {
    if(message.isStatus) return;
    console.log("message", message);
    
    const chat = await message.getChat();
    console.log("chat", chat);
    
    if (chat.isGroup) return;
    try {
      await processMessage(message, chat);
    } catch (error) {
      logger.error("Error handling message", { 
        error: error.message, 
        stack: error.stack,
        messageId: message.id._serialized
      });
    }
  });
};

const setupWhatsAppShutdown = (client) => {
  process.on("SIGINT", async (signal) => {
    logger.info("Shutting down application...");
    try {
      await client.destroy();
      logger.info("Client destroyed successfully");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown", { error: error.message, stack: error.stack });
      process.exit(1);
    }
  });
};

module.exports = {
  setupMessageHandling,
  setupWhatsAppShutdown
}; 