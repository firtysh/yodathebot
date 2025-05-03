const WAWebJs = require("whatsapp-web.js");
const { parseMsg } = require("../utils/messageParser");
const { commands, fieldValiators, fields, static_messages } = require("../config/config");
const { User } = require("../models/User");
const { Chat } = require("../models/Chat");
const { processWithAI } = require("./aiProcessor");
const logger = require("../config/logger");

/**
 * Handles new user registration process.
 * @param {WAWebJs.Message} message - The message object from WAWebJs.
 * @param {WAWebJs.Chat} chat - The chat object.
 * @param {Object} user - The user object from database.
 */
const processNewUserRegistration = async (message, chat, user) => {
  try {
    const activeField = user.active_field;
    const confirmationState = user.field_confirmation_state;
    const isLastField = fields.indexOf(activeField) === fields.length - 1;
    
    if (confirmationState === "asked") {
      const validatedField = fieldValiators[activeField](message.body);
      if (validatedField) {
        user[activeField] = validatedField;
        user.field_confirmation_state = "confirmation";
        await user.save();
        logger.info(`User ${user.w_id} updated ${activeField} field`, { field: activeField, value: message.body });
        return await chat.sendMessage(
          `Your entered ${activeField} is *${message.body}* \n (Reply with *yes* or *no* only)`
        );
      } else {
        logger.warn(`Invalid ${activeField} provided by user ${user.w_id}`, { value: message.body });
        return await chat.sendMessage(
          `*${message.body}* is not a valid ${activeField} ${
            activeField === "dob" ? "The format is dd/mm/yyyy" : ""
          }`
        );
      }
    } else {
      if (message.body.toLowerCase() === "yes") {
        if (isLastField) {
          user.profile_completed = true;
          await user.save();
          logger.info(`User ${user.w_id} completed profile setup`, { firstName: user.firstName });
          return await chat.sendMessage(
            `Well done *${user.firstName}* 🎊️ \n Now you can use the rest of the features.`
          );
        } else {
          user.active_field = fields[fields.indexOf(activeField) + 1];
          user.field_confirmation_state = "asked";
          await user.save();
          logger.info(`User ${user.w_id} moving to next field`, { nextField: user.active_field });
          return await chat.sendMessage(
            `What is your ${fields[fields.indexOf(activeField) + 1]} ${
              fields[fields.indexOf(activeField) + 1] === "dob"
                ? "dd/mm/yyyy"
                : ""
            }`
          );
        }
      } else if (message.body.toLowerCase() === "no") {
        user.field_confirmation_state = "asked";
        await user.save();
        logger.info(`User ${user.w_id} rejected ${activeField} value`, { field: activeField, value: user[activeField] });
        return await chat.sendMessage(`Re enter your ${activeField}`);
      } else {
        return await chat.sendMessage(
          `Your entered ${activeField} is *${user[activeField]}* \n (Reply with *yes* or *no* only)`
        );
      }
    }
  } catch (error) {
    logger.error("Error in new user registration", {
      error: error.message,
      stack: error.stack,
      userId: user.w_id,
      activeField: user.active_field
    });
    throw error;
  }
};

/**
 * Processes incoming messages and performs appropriate actions.
 * @param {WAWebJs.Message} message - The message object from WAWebJs.
 * @param {WAWebJs.Chat} chat - The chat object.
 */
const processMessage = async (message, chat) => {
  try {
    await chat.sendStateTyping();
    const user = await User.findOne({ w_id: chat.id._serialized });
    
    if (!user) {
      const newUser = await User.create({
        w_id: chat.id._serialized,
        phoneNumber: chat.id.user,
        active_field: "firstName",
        field_confirmation_state: "asked",
      });
      logger.info("New user created", { userId: newUser.w_id });
      await chat.sendMessage(static_messages.initial);
      return await chat.sendMessage("What is your firstName?");
    }

    if (!user.profile_completed) {
      return await processNewUserRegistration(message, chat, user);
    }

    const { cmd, msg } = parseMsg(message.body);
    logger.debug("Message processed", { command: cmd, message: msg, userId: user.w_id });

    if (cmd) {
      if (cmd in commands) {
        return message.reply(commands[cmd].exec({ message, arg: msg }));
      } else {
        logger.warn("Invalid command received", { command: cmd, userId: user.w_id });
        return message.reply("Invalid Command");
      }
    } else {
      let chatHistory = await Chat.findOne({ user: user._id });
      if (!chatHistory) {
        chatHistory = await Chat.create({
          user: user._id,
          messages: [
            {
              role: "user",
              content: message.body,
            },
          ],
        });
        user.chats.push(chatHistory._id);
        await user.save();
        logger.info("New chat history created", { userId: user.w_id });
      } else {
        chatHistory.messages.push({
          role: "user",
          content: message.body,
        });
        await chatHistory.save();
      }

      const reply = await processWithAI(chatHistory.messages);
      chatHistory.messages.push({
        role: "assistant",
        content: reply,
      });
      await chatHistory.save();
      return await message.reply(reply);
    }
  } catch (error) {
    logger.error("Error processing message", {
      error: error.message,
      stack: error.stack,
      userId: chat.id._serialized
    });
    throw error;
  }
};

module.exports = { processMessage }; 