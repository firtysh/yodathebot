const { Client, LocalAuth } = require("whatsapp-web.js");
const logger = require("../config/logger");
const { setupMessageHandling, setupWhatsAppShutdown } = require("./messageHandler");

const createWhatsAppClient = () => {
  return new Client({
    authStrategy: new LocalAuth({
      dataPath: "auth",
    }),
    puppeteer: {
      headless: true,
    },
  });
};

const wpClient = createWhatsAppClient();



const setupClientEvents = (client) => {
  client.on("authenticated", async (message) => {
    logger.info("WP Client authenticated successfully");
  });
  client.on("auth_failure", (message) => {
    logger.error("WP Client Authentication failed", { message });
  });
  client.on("ready", () => {
    logger.info("WP Client is ready!");
  });
  client.on("qr", (qr) => {
    logger.info("WP Client New QR code generated");
    require("qrcode-terminal").generate(qr, { small: true });
  });
  client.on("remote_session_saved", () => {
    logger.info("WP Client Remote session saved successfully");
  });
  return client;
};

setupClientEvents(wpClient);
setupMessageHandling(wpClient);
setupWhatsAppShutdown(wpClient);



module.exports = {
  wpClient,
}; 