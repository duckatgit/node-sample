const { formatTime } = require("../utils/utility");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_NUMBER;
const client = require("twilio")(accountSid, authToken);

module.exports = {
  sendCodeInNumber,
  notifyStaffViaSms,
};

// Function to send code in mobile number
async function sendCodeInNumber(userName, code, phone) {
  return new Promise(async function (resolve, reject) {
    client.messages
      .create({
        body: `Use verification code ${code} to reset your Treo password`,
        from: twilioNumber,
        to: phone,
      })
      .then((result) => {
        return resolve(result.sid);
      })
      .catch((error) => {
        return resolve(error?.moreInfo ? error?.moreInfo : "Twilio Error!");
      });
  });
}

// Function to notify staff via sms
async function notifyStaffViaSms(
  userName,
  date,
  time,
  phone,
  staffName,
  practiceName,
  type,
  action,
  meetingLink
) {
  return new Promise(async function (resolve, reject) {
    let messageContent;
    if (type === "video") {
      switch (action) {
        case "create":
          if (staffName === null) {
            messageContent = `Hi ${userName}, your next ${practiceName} telehealth appointment is scheduled at ${time} on ${date}. Please use the link below to connect and make sure you are online ten minutes before your scheduled appointment time. Link: ${meetingLink}`;
          } else {
            messageContent = `Hi ${userName}, your next ${practiceName} telehealth appointment with ${staffName} is at ${time} on ${date}. Please use the link below to connect and make sure you are online ten minutes before your scheduled appointment time. Link: ${meetingLink}`;
          }
          break;
        case "update":
          if (staffName === null) {
            messageContent = `Hi ${userName}, your next ${practiceName} telehealth appointment is updated at ${time} on ${date}. Please use the link below to connect and make sure you are online ten minutes before your scheduled appointment time. Link: ${meetingLink}`;
          } else {
            messageContent = `Hi ${userName}, your next ${practiceName} telehealth appointment with ${staffName} is updated at ${time} on ${date}. Please use the link below to connect and make sure you are online ten minutes before your scheduled appointment time. Link: ${meetingLink}`;
          }
          break;
        case "cancel":
          messageContent = `Hi ${userName}, Appointment has been cancelled of ${date} at ${time}`;
          break;
        default:
      }
    } else {
      switch (action) {
        case "create":
          if (staffName === null) {
            messageContent = `Hi ${userName}, your next ${practiceName} appointment is scheduled for ${time} on ${date}`;
          } else {
            messageContent = `Hi ${userName}, your next ${practiceName} appointment with ${staffName} is scheduled for ${time} on ${date}. Please wear a mask. If you have ANY cough/cold symptoms or have a fever, you must have a negative RAT on the day of your appointment in order to attend`;
          }
          break;
        case "update":
          if (staffName === null) {
            messageContent = `Hi ${userName}, your next ${practiceName} appointment is updated for ${time} on ${date}`;
          } else {
            messageContent = `Hi ${userName}, your next ${practiceName} appointment with ${staffName} is updated for ${time} on ${date}. Please wear a mask. If you have ANY cough/cold symptoms or have a fever, you must have a negative RAT on the day of your appointment in order to attend`;
          }

          break;
        case "cancel":
          messageContent = `Hi ${userName}, Appointment has been cancelled of ${date} at ${time}`;
          break;
        default:
      }
    }

    client.messages
      .create({
        body: messageContent,
        from: twilioNumber,
        to: phone,
      })
      .then((result) => {
        return resolve(result.sid);
      })
      .catch((error) => {
        return resolve(error?.moreInfo ? error?.moreInfo : "Twilio Error!");
      });
  });
}
