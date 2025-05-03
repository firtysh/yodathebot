const { download } = require("../controllers/download");
const { greet } = require("../controllers/greet");

const initial = process.env.INITIAL;
const commands = {
  ["hi"]: {
    hidden: false,
    isGroupOnly: false,
    description: "Greets you",
    exec: greet,
  },
  ["yt-audio"]: {
    hidden: false,
    isGroupOnly: false,
    description: "Download audio only from youtube videos",
  },
  ["ytdl"]: {
    hidden: false,
    isGroupOnly: false,
    description: "Download youtube videos",
  },
  ["dl"]: {
    hidden: false,
    isGroupOnly: false,
    description: "Download videos from link",
    exec: download,
  },
};

const fieldValiators = {
  ["firstName"]: (firstname) => {
    const pattern = /^[a-zA-Z]{2,25}$/;
    return pattern.test(firstname) ? firstname : false;
  },
  ["lastName"]: (lastName) => {
    const pattern = /^[a-zA-Z]{2,25}$/;
    return pattern.test(lastName) ? lastName : false;
  },
  ["email"]: (email) => {
    const pattern =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return pattern.test(email) ? email : false;
  },
  ["college"]: (college) => {
    return college;
  },
  ["dob"]: (dob) => {
    const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!dateRegex.test(dob)) {
      return false; // Invalid format
    }
    const dateParts = dob.split("/");
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1; // Months are 0-indexed
    const year = parseInt(dateParts[2], 10);

    const dateObject = new Date(year, month, day);

    // Check if the created date is valid
    if (isNaN(dateObject.getTime())) {
      return false; // Invalid date
    }
    return dateObject;
  },
};
const fields = ["firstName", "lastName", "email", "college", "dob"];

const static_messages = {
  ["initial"]: "Hello 🤔️, Uh oh! I don't even know your name 😕️",
  ["error"]: () => "Uh oh! I've ran into a problem. I've reported the issue to the developer he'll be looking into it.",
  ["success"]: () => "",
  ["progress"]: () => "",
};

module.exports = { initial, commands, fieldValiators, fields, static_messages };
