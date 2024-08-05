const WAWebJs = require("whatsapp-web.js");
const { verifyMsg } = require("./verifyMsg");
const { commands, fieldValiators, fields, static_messages } = require("../config/config");
const { User } = require("../models/User");
const { Chat } = require("../models/Chat");
const { getGroqChatCompletion } = require("./groq");

/**
 * Handles new user.
 * @param {WAWebJs.Message} m - The message object from WAWebJs.
 * @param {WAWebJs.Chat} chat - The chat object.
 */
const newUserHandler = async (m, chat, user) => {
  const activeField = user.active_field;
  const confirmationState = user.field_confirmation_state;
  const isLastField = fields.indexOf(activeField) === fields.length - 1;
  if (confirmationState === "asked") {
    const validatedField = fieldValiators[activeField](m.body);
    if (validatedField) {
      user[activeField] = validatedField;
      user.field_confirmation_state = "confirmation";
      await user.save();
      return await chat.sendMessage(
        `Your entered ${activeField} is *${m.body}* \n (Reply with *yes* or *no* only)`
      );
    } else {
      return await chat.sendMessage(
        `*${m.body}* is not a valid ${activeField} ${
          activeField === "dob" ? "The format is dd/mm/yyyy" : ""
        }`
      );
    }
  } else {
    if (m.body.toLowerCase() === "yes") {
      if (isLastField) {
        user.profile_completed = true;
        user.save();
        return await chat.sendMessage(
          `Well done *${user.firstName}* 🎊️ \n Now you can use the rest of the features.`
        );
      } else {
        user.active_field = fields[fields.indexOf(activeField) + 1];
        user.field_confirmation_state = "asked";
        await user.save();
        return await chat.sendMessage(
          `What is your ${fields[fields.indexOf(activeField) + 1]} ${
            fields[fields.indexOf(activeField) + 1] === "dob"
              ? "dd/mm/yyyy"
              : ""
          }`
        );
      }
    } else if (m.body.toLowerCase() === "no") {
      user.field_confirmation_state = "asked";
      await user.save();
      return await chat.sendMessage(`Re enter your ${activeField}`);
    } else {
      return await chat.sendMessage(
        `Your entered ${activeField} is *${user[activeField]}* \n (Reply with *yes* or *no* only)`
      );
    }
  }
};

/**
 * Handles a message and performs actions based on its content.
 * @param {WAWebJs.Message} m - The message object from WAWebJs.
 * @param {WAWebJs.Chat} chat - The chat object.
 */
const handleMsg = async (m, chat) => {
  await chat.sendStateTyping();
  const user = await User.findOne({ w_id: chat.id._serialized });
  // console.log(chat);
  if (!user) {
    await User.create({
      w_id: chat.id._serialized,
      phoneNumber: chat.id.user,
      active_field: "firstName",
      field_confirmation_state: "asked",
    });
    await chat.sendMessage(static_messages.initial);
    return await chat.sendMessage("What is your firstName?");
  }
  if (!user.profile_completed) {
    return await newUserHandler(m, chat, user);
  }

  const { cmd, msg } = verifyMsg(m.body);
  console.log({ cmd, msg });
  if (cmd) {
    if (cmd in commands) {
      // if()
      return m.reply(commands[cmd].exec({m,arg:msg}));
    } else {
      return m.reply("Invalid Command");
    }
  } else {
    let chat = await Chat.findOne({ user: user._id });
    if (!chat) {
      chat = await Chat.create({
        user: user._id,
        messages: [
          {
            role: "user",
            content: m.body,
          },
        ],
      });
      user.chats.push(chat._id);
      user
        .save()
        .then()
        .catch((err) => {
          console.error(err);
        });
    } else {
      chat.messages.push({
        role: "user",
        content: m.body,
      });
      await chat.save();
    }
    const reply = await getGroqChatCompletion(chat.messages);
    chat.messages.push({
      role: "assistant",
      content: reply,
    });
    await chat.save();
    return await m.reply(reply);
  }
};

module.exports = { handleMsg };
