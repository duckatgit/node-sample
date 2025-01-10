const { verifyToken } = require("../helpers/common");
const { formatTime, getFormatDateTime } = require("../utils/utility");
const { selectAllData } = require("./dbService");
const { readNotifyStaffTemplate } = require("./emailService");
const { notifyStaffViaSms } = require("./twillioService");
const moment = require("moment");

module.exports = {
  getRandomNumber,
  verifyAuthToken,
  dailyScheduleSmsEmail,
  isValidJson,
  getPagination,
  sortData,
  searchData,
  sortRecentData,
};

// Function to get random number
async function isValidJson(data) {
  return new Promise(async function (resolve, reject) {
    if (data) {
      try {
        const obj = JSON.parse(data);
        if (obj && typeof obj === "object") {
          return resolve(true);
        }
        return resolve(false);
      } catch (error) {
        return resolve(false);
      }
    }
    return reject(false);
  });
}

// Function to get random number
async function getRandomNumber(start, end) {
  return new Promise(async function (resolve, reject) {
    try {
      const randomNumber = Math.floor(start + Math.random() * end);
      return resolve(randomNumber);
    } catch (error) {
      return reject(error);
    }
  });
}

//function for pagination
async function getPagination(data, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (payload.page && payload.take) {
        const startIndex = (payload.page - 1) * payload.take;
        const endIndex = payload.page * payload.take;
        const paginatedData = data.slice(startIndex, endIndex);
        return resolve({
          data: paginatedData,
          currentPage: payload.page,
          itemsPerPage: payload.take,
          totalItems: data.length,
          totalPages: Math.ceil(data.length / payload.take),
        });
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function for sort data
async function sortData(data, sort) {
  return new Promise(async function (resolve, reject) {
    try {
      if (sort && sort.type && sort.column) {
        let result = [];
        if (sort.type === "asc") {
          result = data.sort((x, y) => {
            if (x[sort.column] < y[sort.column]) {
              return -1;
            } else {
              return 1;
            }
          });
        } else {
          result = data.sort((x, y) => {
            if (x[sort.column] > y[sort.column]) {
              return -1;
            } else {
              return 1;
            }
          });
        }
        return resolve(result);
      } else {
        return resolve(data);
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//function for search data
function searchData(data, payload, searchFields) {
  if (!payload || !searchFields || !searchFields.length) {
    return data;
  }

  const searchTerm = payload.toLowerCase().trim();
  return data.filter((item) => {
    for (const field of searchFields) {
      const value = item[field]?.toString().toLowerCase();
      if (value && value.includes(searchTerm)) {
        return true;
      }
    }
    return false;
  });
}

// Function to verify auth token
async function verifyAuthToken(headerToken) {
  return new Promise(async function (resolve, reject) {
    try {
      const authToken = headerToken;
      const tokenData = authToken.split(" ");
      const token = tokenData[1];
      if (token) {
        const result = await verifyToken(token);
        if (result) {
          const userId = Number(result.userId);
          const loginUserId = Number(result.loginUserId);
          const link = result.practiceLink;
          return resolve({
            userId: userId,
            loginUserId: loginUserId,
            practiceLink: link,
          });
        } else {
          return reject("Unauthorizd!");
        }
      } else {
        return reject("Unauthorizd!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to daily schedule sms & email
async function dailyScheduleSmsEmail() {
  const data = await selectAllData(
    "public",
    ["practiceLink", "practiceName", "isDeleted"],
    "tenants"
  );
  const filterData = data.filter((item) => item.isDeleted !== true);

  for (item of filterData) {
    const staffData = await selectAllData(item.practiceLink, "*", "staff");
    const checkedStaffData = staffData.filter(
      (staff) => staff.isDeleted !== true
    );

    for (innerStaffData of checkedStaffData) {
      if (
        innerStaffData.dailyScheduleSms === true ||
        innerStaffData.dailyScheduleEmail === true
      ) {
        const idWhere = {
          staffId: innerStaffData.id,
        };
        const scheduleData = await selectAllData(
          item.practiceLink,
          "*",
          "schedule",
          idWhere
        );

        for (dailyScheduledData of scheduleData) {
          const dbDateTime = getFormatDateTime(dailyScheduledData);
          const dbStartDateTime = moment(dbDateTime);
          const currentDateTime = moment();
          if (dbStartDateTime > currentDateTime) {
            if (innerStaffData.dailyScheduleSms === true) {
              await notifyStaffViaSms(
                innerStaffData.name,
                dailyScheduledData.scheduleDate,
                formatTime(dailyScheduledData.scheduleTime),
                innerStaffData.phone,
                null,
                item.practiceLink,
                innerStaffData.type,
                "create",
                dailyScheduledData.meetingLink,
                dailyScheduledData.roomId
              );
            }

            if (innerStaffData.dailyScheduleEmail === true) {
              const subject = "Appointment";

              await readNotifyStaffTemplate(
                innerStaffData.name,
                dailyScheduledData.scheduleDate,
                formatTime(dailyScheduledData.scheduleTime),
                subject,
                innerStaffData.email,
                item.practiceLink,
                dailyScheduledData.type,
                "create",
                dailyScheduledData.meetingLink,
                dailyScheduledData.roomId
              );
            }
          }
        }
      }
    }
  }
}

// Function to sort recent data
function sortRecentData(data) {
  const result = data.sort((x, y) => y.created_at - x.created_at);
  return result;
}
