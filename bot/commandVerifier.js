/**
 * Verifies if a message contains a command and extracts it.
 * @param {string} message - The message to verify.
 * @returns {Object} An object containing the command and the message without the command.
 */
const verifyCommand = (message) => {
  const cmd = message.split(" ")[0].toLowerCase();
  const msg = message.slice(cmd.length).trim();
  return { cmd, msg };
};

module.exports = { verifyCommand }; 