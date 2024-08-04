const { default: Groq } = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getGroqChatCompletion = async (chat) => {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: process.env.SYSTEM_PROMPT,
      },
      ...chat
    ],
    model: "llama3-8b-8192",
    temperature : 1.25,
    top_p : 1
  });
  return chatCompletion.choices[0]?.message?.content || "";
};


module.exports = {getGroqChatCompletion}