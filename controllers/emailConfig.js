const fs = require("fs");
const path = require("path");

const emailSubject =
  "Welcome to Shop.co - Your Ultimate Online Shopping Destination!";
const emailMessage = fs.readFileSync(
  path.resolve(__dirname, "./emailConfig/emailTemplate.html"),
  "utf8"
);

module.exports = { emailSubject, emailMessage };
