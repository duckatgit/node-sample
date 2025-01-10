const nodemailer = require("nodemailer");
const config = require("../helpers/config.json");
const smtpTransporter = nodemailer.createTransport(config.mailConfig);

module.exports = {
  sendMail,
};

async function sendMail(mailOptions) {
  return new Promise(async function (resolve, reject) {
    smtpTransporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
      } else {
        resolve(info.response);
      }
    });
  });
}
