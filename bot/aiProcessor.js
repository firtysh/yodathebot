const { Groq } = require("groq-sdk");
const logger = require("../config/logger");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/**
 * Processes chat messages using Groq AI.
 * @param {Array} messages - Array of chat messages.
 * @returns {Promise<string>} The AI-generated response.
 */
const processWithAI = async (messages) => {
  try {
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "mistral-saba-24b",
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    logger.error("Error processing with AI", {
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = { processWithAI }; 