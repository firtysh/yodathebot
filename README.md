# YodaTheBot

A sophisticated WhatsApp chatbot powered by AI for natural conversations, user management, and multimedia capabilities.

![License](https://img.shields.io/badge/License-ISC-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-v16+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-v5+-green)

## 📖 Overview

YodaTheBot is a feature-rich WhatsApp chatbot built with Node.js that combines AI-powered conversations with user management and multimedia capabilities. The bot leverages Groq's AI models for natural language processing, WhatsApp Web.js for messaging, and MongoDB for data persistence.

## ✨ Features

- **AI-Powered Conversations**: Integrates with Groq's Mistral model for natural, human-like interactions
- **User Management**: Multi-step registration with field validation and profile storage
- **Media Downloads**: Commands for downloading videos and extracting audio from YouTube
- **Command System**: Custom commands like `hi`, `dl`, `ytdl`, and `yt-audio`
- **Persistent Chat History**: Stores conversations for continuity
- **Structured Logging**: Comprehensive logging system with rotating log files
- **RESTful API**: Express server for bot management and health monitoring

## 🛠️ Technologies Used

- **Backend**: Node.js, Express
- **WhatsApp Integration**: WhatsApp Web.js, Puppeteer
- **Database**: MongoDB with Mongoose
- **AI Service**: Groq API
- **Logging**: Winston
- **Authentication**: LocalAuth for WhatsApp session persistence
- **Development**: Nodemon for hot reloading

## 🗂️ Project Structure

```
project/
├── bot/                  # Core bot logic
│   ├── messageProcessor.js  # Message handling and user registration
│   ├── commandVerifier.js   # Command verification and extraction
│   └── aiProcessor.js      # AI integration with Groq
├── whatsapp/             # WhatsApp integration
│   ├── index.js          # Main WhatsApp module
│   ├── client.js         # Client configuration and setup
│   └── messageHandler.js  # Message handling and shutdown logic
├── server/               # Express server
│   └── index.js          # Server configuration and API endpoints
├── models/               # Database models
│   ├── User.js           # User model definition
│   └── Chat.js           # Chat model definition
├── config/               # Configuration files
│   ├── config.js         # Bot configuration (commands, fields, etc.)
│   └── logger.js         # Logging configuration
├── utils/                # Utility functions
│   └── messageParser.js  # Message parsing utilities
├── controllers/          # Command controllers
│   ├── download.js       # Download functionality
│   └── greet.js          # Greeting functionality
└── index.js              # Main application entry point
```

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/yodathebot.git
   cd yodathebot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/yodathebot
   GROQ_API_KEY=your_groq_api_key
   PORT=3000
   INITIAL=!
   ```

4. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Authenticate WhatsApp**
   Scan the QR code that appears in the console with WhatsApp on your phone to authenticate the session.

## ⚙️ Configuration

### Bot Commands
Commands can be configured in `config/config.js` by adding to the `commands` object:

```javascript
const commands = {
  ["command-name"]: {
    hidden: false,
    isGroupOnly: false,
    description: "Command description",
    exec: commandFunction,
  },
};
```

### User Registration Fields
User registration fields can be modified in `config/config.js`:

```javascript
const fields = ["firstName", "lastName", "email", "college", "dob"];
```

## 🚀 Usage

### Interacting with the Bot
1. Start a chat with the WhatsApp number linked to the bot
2. New users will be guided through the registration process
3. Use commands by typing them (e.g., `hi`, `dl https://example.com/video.mp4`)
4. For regular conversations, simply send messages and the AI will respond

### API Endpoints
- `GET /health`: Check if the server is running
- `GET /`: General information about the bot
- `GET /status`: Get the current WhatsApp connection status

## 🧠 AI Integration

YodaTheBot uses Groq's Mixtral-8x7b model for generating human-like responses. The integration is handled in `bot/aiProcessor.js` and can be customized by adjusting parameters like temperature and max tokens.

## 📊 Logging

Logs are stored in the `logs` directory:
- `error.log`: Contains only error messages
- `combined.log`: Contains all log levels

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [WhatsApp Web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [Groq API](https://groq.com)
- [Mongoose](https://mongoosejs.com)
- [Express](https://expressjs.com)
- [Winston](https://github.com/winstonjs/winston)

---

Made with ❤️ by [Suman Mandal](https://github.com/yourusername) 