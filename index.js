require("dotenv").config();
const { Client, RemoteAuth, LocalAuth } = require("whatsapp-web.js");
const http = require("node:http");

// Require database
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const qrcode = require("qrcode-terminal");
const { handleMsg } = require("./settings/handler");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      data: "Hello World!",
    })
  );
});

// Load the session data
mongoose.connect(process.env.MONGODB_URI).then(async () => {
  // const store = new MongoStore({ mongoose: mongoose });
  // if (await store.sessionExists({ session: "RemoteAuth" })) {
  //   // await store.extract({ session: "RemoteAuth" });
  //   console.log("extraction complete");
  // }
  const client = new Client({
    authStrategy: new LocalAuth({
      dataPath: "auth",
    }),
    puppeteer: {
      // executablePath : '/usr/bin/google-chrome-stable',
      headless: true,
    },
    // authStrategy: new RemoteAuth({
    //   store: store,
    //   backupSyncIntervalMs: 60000,
    //   dataPath: "remoteAuth",
    // }),
  });

  client.on("authenticated", async (message) => {
    console.log("Authenticated");
    // await store.save({ session: "RemoteAuth" });
  });
  client.on("auth_failure", (message) => {
    console.log("FAILED TO AUTHENTICATE ", message);
  });

  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("remote_session_saved", () => {
    console.log("Remote Session saved");
  });

  client.on("message", async (message) => {
    if(message.isStatus) return
    const chat = await message.getChat();
    if (chat.isGroup) return;
    return await handleMsg(message, chat);
  });

  process.on("SIGINT", async (signal) => {
    console.log("Shutting Down...");
    await client.destroy();
    console, console.log("Dead");
    process.exit(0);
  });
  client.initialize();
  server.listen(process.env.PORT || 3000)
});
