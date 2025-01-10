const moment = require("moment/moment");

// function to format time
const formatTime = (time) => {
  const format = moment(time, ["HH:mm"]).format("hh:mm A");
  return format;
};

// convert date and time
const getFormatDateTime = (item) => {
  const changeDateFormat = item.scheduleDate.split("-").reverse().join("-");

  const mergedDateTime = `${changeDateFormat}T${item.scheduleTime}.000Z`;

  const dateTime = moment(mergedDateTime)
    .utcOffset("+0000")
    .format("YYYY-MM-DD HH:mm");
  return dateTime;
};

// function to check 30 minutes of current date time
const checkDateTime = (item) => {
  const getDateTime = getFormatDateTime(item);
  const subtractOneDay = moment().subtract(1, "day");
  const dateTimeStartOff = moment(subtractOneDay).startOf("date");
  const payloadDateTime = moment(getDateTime);

  if (payloadDateTime > dateTimeStartOff) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  formatTime,
  getFormatDateTime,
  checkDateTime,
};
