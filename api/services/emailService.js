const fs = require("fs");
const handlebars = require("handlebars");
const config = require("../helpers/config.json");
const { sendMail } = require("../utils/mailer");
const path = require("path");
const { createToken } = require("../helpers/common");
const { formatTime } = require("../utils/utility");

module.exports = {
  readVerifyEmailTemplate,
  readVerificationCodeTemplate,
  readInviteStaffTemplate,
  readNotifyStaffTemplate,
};

// logo path
const logoPath = path.join(__dirname, "../utils/images/logo.png");
const logoAttachment = {
  filename: "logo.gif",
  path: logoPath,
  cid: "img",
  contentType: "image/png;",
  contentDisposition: "inline",
};

// Function to read Verify email template
async function readVerifyEmailTemplate(
  userId,
  userName,
  email,
  pLink,
  subject
) {
  return new Promise(async function (resolve, reject) {
    try {
      const filePath = path.join(
        __dirname,
        "../utils/templates/verify-email.html"
      );
      const source = fs.readFileSync(filePath, "utf-8").toString();
      const template = handlebars.compile(source);
      const data = { email: email };
      const token = await createToken(data, "1h");
      const webUrl = process.env.WEB_URL.split("//");
      const link = `${webUrl[0]}//${pLink}.${webUrl[1]}/verify-account/${token}/${userId}`;
      let practiceLink = `${webUrl[0]}//${pLink}.${webUrl[1]}/login`;
      const replacements = {
        userName: userName,
        verifyLink: link,
        practiceLink: practiceLink,
      };
      const htmlToSend = template(replacements);
      const mailOptions = config.mailOptions;
      mailOptions.to = email;
      mailOptions.subject = subject;
      mailOptions.html = htmlToSend;
      mailOptions.attachments = [logoAttachment];

      const emailRes = await sendMail(mailOptions);
      resolve(emailRes);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to read Verification Code template
async function readVerificationCodeTemplate(userName, code, email, subject) {
  return new Promise(async function (resolve, reject) {
    try {
      const filePath = path.join(
        __dirname,
        "../utils/templates/verification-code.html"
      );
      const source = fs.readFileSync(filePath, "utf-8").toString();
      const template = handlebars.compile(source);

      const replacements = {
        userName: userName,
        verificationCode: code,
      };
      const htmlToSend = template(replacements);
      const mailOptions = config.mailOptions;
      mailOptions.to = email;
      mailOptions.subject = subject;
      mailOptions.html = htmlToSend;
      mailOptions.attachments = [logoAttachment];

      const emailRes = await sendMail(mailOptions);
      resolve(emailRes);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to read invitation staff template
async function readInviteStaffTemplate(
  staffId,
  userName,
  email,
  pLink,
  subject
) {
  return new Promise(async function (resolve, reject) {
    try {
      const filePath = path.join(
        __dirname,
        "../utils/templates/invite-staff.html"
      );
      const source = fs.readFileSync(filePath, "utf-8").toString();
      const template = handlebars.compile(source);
      const data = { email: email };
      const token = await createToken(data, null);
      const webUrl = process.env.WEB_URL.split("//");
      const link = `${webUrl[0]}//${pLink}.${webUrl[1]}/set-password-staff/${token}/${staffId}`;
      let practiceLink = `${webUrl[0]}//${pLink}.${webUrl[1]}/login`;
      const replacements = {
        userName: userName,
        setPasswordLink: link,
        practiceLink: practiceLink,
      };
      const htmlToSend = template(replacements);
      const mailOptions = config.mailOptions;
      mailOptions.to = email;
      mailOptions.subject = subject;
      mailOptions.html = htmlToSend;
      mailOptions.attachments = [logoAttachment];

      const emailRes = await sendMail(mailOptions);
      resolve(emailRes);
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to notify staff template
async function readNotifyStaffTemplate(
  userName,
  date,
  time,
  subject,
  email,
  practiceName,
  type,
  action,
  meetingLink
) {
  return new Promise(async function (resolve, reject) {
    try {
      let filePath;

      if (type === "video" && (action === "create" || action === "update")) {
        filePath = path.join(__dirname, "../utils/templates/notify-staff.html");
      } else {
        filePath = path.join(
          __dirname,
          "../utils/templates/notify-staff-cancel.html"
        );
      }

      const source = fs.readFileSync(filePath, "utf-8").toString();
      const template = handlebars.compile(source);

      let messageContent;

      if (type === "video") {
        switch (action) {
          case "create":
            messageContent = `Your next ${practiceName} telehealth appointment is scheduled at ${time} on ${date}. Please click the below button to connect and make sure you are online ten minutes before your scheduled appointment time.`;
            break;
          case "update":
            messageContent = `Your next ${practiceName} telehealth appointment is updated at ${time} on ${date}. Please click the below button to connect and make sure you are online ten minutes before your scheduled appointment time.`;
            break;
          case "cancel":
            messageContent = `Appointment has been cancelled created on ${date} at ${time}`;
            break;
          default:
        }
      } else {
        switch (action) {
          case "create":
            messageContent = `Your next ${practiceName} appointment is scheduled for ${time} on ${date}. Please wear a mask. If you have ANY cough/cold symptoms or have a fever, you must have a negative RAT on the day of your appointment in order to attend`;
            break;
          case "update":
            messageContent = `Your next ${practiceName} appointment is updated for ${time} on ${date}. Please wear a mask. If you have ANY cough/cold symptoms or have a fever, you must have a negative RAT on the day of your appointment in order to attend`;
            break;
          case "cancel":
            messageContent = `Appointment has been cancelled created on ${date} at ${time}`;
            break;
          default:
        }
      }

      let replacements;
      if (type === "video" && (action === "create" || action === "update")) {
        replacements = {
          userName: userName,
          date: date,
          time: time,
          subject: subject,
          email: email,
          content: messageContent,
          meetingLink: meetingLink,
        };
      } else {
        replacements = {
          userName: userName,
          date: date,
          time: time,
          subject: subject,
          email: email,
          content: messageContent,
        };
      }

      const htmlToSend = template(replacements);
      const mailOptions = config.mailOptions;
      mailOptions.to = email;
      mailOptions.subject = subject;
      mailOptions.html = htmlToSend;
      mailOptions.attachments = [logoAttachment];

      const emailRes = await sendMail(mailOptions);
      resolve(emailRes);
    } catch (error) {
      return reject(error);
    }
  });
}
