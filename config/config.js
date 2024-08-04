const { download } = require("../controllers/download");
const { greet } = require("../controllers/greet");

const initial = process.env.INITIAL;
const commands = {
  ["hi"]: {
    hidden: false,
    isGroupOnly: false,
    description: "Greets you",
    exec: greet
  },
  ["dl"] : {
    hidden : false,
    isGroupOnly : false,
    description : "Download youtube videos",
    exec: download
  }
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
const fields = ["firstName","lastName","email","college","dob"]

module.exports = { initial, commands,fieldValiators,fields };
