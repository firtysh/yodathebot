const { initial } = require("../config/config");

const verifyMsg = (msg) => {
  if (msg[0] === initial) {
    msg = msg.split(initial)[1].split(/(?<=^\S+)\s/);
    return { cmd: msg[0].toLowerCase(), msg: msg[1] };
  }
  return { cmd: null, msg: msg };
};


module.exports = {verifyMsg}