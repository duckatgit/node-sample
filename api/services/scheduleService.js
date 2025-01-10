const {
  isUserExist,
  insertData,
  selectFirstData,
  selectAllData,
  updateData,
  selectAllDataJoin,
  selectAllDataMultipleJoin,
} = require("./dbService");
const { readNotifyStaffTemplate } = require("../services/emailService");
const { notifyStaffViaSms } = require("./twillioService");
const {
  formatTime,
  getFormatDateTime,
  checkDateTime,
} = require("../utils/utility");
const moment = require("moment");
const knex = require("../config/db");

module.exports = {
  getAppointmentUser,
  getAppointmentByIdUser,
  createAppointmentUser,
  updateAppointmentUser,
  cancelAppointmentUser,
  updateAppointmentDateUser,
  getAllAppointmentsUser,
  getInstantMeetingUser,
  updateInstantMeetingUser,
  updateAppointmentStatusUser,
};

// Function to create appointment
async function createAppointmentUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const meetingLink = payload?.meetingLink ? payload.meetingLink : "";
        const scheduleData = {
          type: payload.type,
          isPatientNotifyViaSms: payload.isPatientNotifyViaSms,
          staffId: payload.staffId,
          isPractitionerNotifyViaSms: payload.isPractitionerNotifyViaSms,
          isPractitionerNotifyViaEmail: payload.isPractitionerNotifyViaEmail,
          scheduleDate: payload.scheduleDate,
          scheduleTime: payload.scheduleTime,
          duration: payload.duration,
          procedures: payload.procedures,
          notes: payload.notes,
          title: payload.title,
          isDeleted: false,
          created_at: new Date(),
          updated_at: new Date(),
        };

        if (payload.type === "video") {
          scheduleData.meetingLink = payload.meetingLink;
          scheduleData.roomId = payload.roomId;
        }

        const appointmentData = {
          staffId: payload.staffId,
          scheduleDate: payload.scheduleDate,
          scheduleTime: payload.scheduleTime,
          duration: payload.duration,
          created_at: new Date(),
          updated_at: new Date(),
        };

        const data = await selectAllData(practiceLink, "*", "schedule");
        const filterData = data.filter(
          (item) => item.isDeleted !== true && item.staffId === payload.staffId
        );
        const checkDateTimeStartOff = checkDateTime(payload);

        if (!checkDateTimeStartOff) {
          return reject("Appointment cannot be schedule with past date");
        } else {
          for (let item of filterData) {
            const dbDateTime = getFormatDateTime(item);
            const dbStartDateTime = moment(dbDateTime);
            const dbEndDateTime = moment(dbDateTime).add(
              item.duration,
              "minutes"
            );

            const payloadCurrentDateTm = getFormatDateTime(payload);
            const payLoadStartDateTime = moment(payloadCurrentDateTm);

            if (
              payLoadStartDateTime >= dbStartDateTime &&
              payLoadStartDateTime <= dbEndDateTime
            ) {
              return reject(
                "Slot already booked for the requested date and time"
              );
            }
          }

          const patientIdWhere = {
            id: payload.patientId,
          };
          const patientData = await selectFirstData(
            practiceLink,
            "*",
            "patients",
            patientIdWhere
          );

          if (patientData) {
            scheduleData.patientId = patientData.id;
            appointmentData.patientId = patientData.id;
          }

          const result = await insertData(
            practiceLink,
            scheduleData,
            ["id", "type", "patientId", "staffId"],
            "schedule"
          );

          if (payload.patientPhone) {
            const patientData = {
              phone: payload.patientPhone,
            };
            await updateData(
              practiceLink,
              patientData,
              ["*"],
              "patients",
              patientIdWhere
            );
          }

          if (result.length > 0) {
            const where = {
              practiceLink,
            };
            const tenantExist = await selectFirstData(
              "public",
              "*",
              "tenants",
              where
            );

            const idWhere = {
              id: payload.staffId,
            };
            const staffData = await selectFirstData(
              practiceLink,
              "*",
              "staff",
              idWhere
            );

            if (payload.isPatientNotifyViaSms === true) {
              const userMeetingLink = meetingLink.split("?");
              await notifyStaffViaSms(
                patientData.name,
                payload.scheduleDate,
                formatTime(payload.scheduleTime),
                patientData.phone,
                staffData.name,
                tenantExist?.practiceName,
                result[0].type,
                "create",
                userMeetingLink[0]
              );
            }

            if (payload.isPractitionerNotifyViaSms === true) {
              await notifyStaffViaSms(
                staffData.name,
                payload.scheduleDate,
                formatTime(payload.scheduleTime),
                staffData.phone,
                null,
                tenantExist?.practiceName,
                result[0].type,
                "create",
                meetingLink
              );
            }
            if (payload.isPractitionerNotifyViaEmail === true) {
              const subject = "Appointment";
              await readNotifyStaffTemplate(
                staffData.name,
                payload.scheduleDate,
                formatTime(payload.scheduleTime),
                subject,
                staffData.email,
                tenantExist?.practiceName,
                result[0].type,
                "create",
                meetingLink
              );
            }

            if (staffData.appointmentsConfirmationSms === true) {
              await notifyStaffViaSms(
                staffData.name,
                payload.scheduleDate,
                formatTime(payload.scheduleTime),
                staffData.phone,
                null,
                tenantExist?.practiceName,
                result[0].type,
                "create",
                meetingLink
              );
            }
            if (staffData.appointmentsConfirmationEmail === true) {
              const subject = "Appointment";
              await readNotifyStaffTemplate(
                staffData.name,
                payload.scheduleDate,
                formatTime(payload.scheduleTime),
                subject,
                staffData.email,
                tenantExist?.practiceName,
                result[0].type,
                "create",
                meetingLink
              );
            }

            appointmentData.scheduleId = result[0].id;
            const appointmentResult = await insertData(
              practiceLink,
              appointmentData,
              ["id"],
              "appointments"
            );

            if (appointmentResult) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          } else {
            return reject("Server error! Please try again");
          }
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//  Function to get appointment
async function getAppointmentUser(userId, practiceLink) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllDataMultipleJoin(
          practiceLink,
          "patients",
          "schedule.patientId",
          "=",
          "patients.id",
          "staff",
          "schedule.staffId",
          "=",
          "staff.id",
          "schedule.*",
          knex.raw(
            "json_build_object('firstName', patients.\"firstName\", 'lastName', patients.\"lastName\", 'email', patients.email, 'phone', patients.phone, 'gender', patients.gender) as patientsData"
          ),

          knex.raw(
            "json_build_object('name', staff.name, 'email', staff.email, 'phone', staff.phone) as staffData"
          ),
          "schedule"
        );
        if (data.length > 0) {
          const filterData = data.filter(
            (item) => item.isDeleted !== true && item.status !== "cancelled"
          );

          const appendDateTimeKey = filterData.map((item) => ({
            ...item,
            scheduleDateTime: moment(getFormatDateTime(item)),
          }));

          const sortedData = appendDateTimeKey.sort(
            (x, y) => x.scheduleDateTime - y.scheduleDateTime
          );

          return resolve(sortedData);
        } else {
          return resolve([]);
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//  Function to get specific appointment
async function getAppointmentByIdUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const appointmentIdWhere = {
          "schedule.id": payload.appointmentId,
        };

        const data = await selectAllDataJoin(
          practiceLink,
          "patients",
          "schedule.patientId",
          "=",
          "patients.id",
          "schedule.*",
          knex.raw(
            "json_build_object('firstName', patients.\"firstName\", 'lastName', patients.\"lastName\", 'email', patients.email, 'phone', patients.phone, 'gender', patients.gender) as patientsData"
          ),
          "schedule",
          appointmentIdWhere
        );

        if (data.length > 0) {
          if (data[0].isDeleted !== true) {
            return resolve(data[0]);
          }
        } else {
          return reject("Appointment doesn't exist");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
// Function to update appointment
async function updateAppointmentUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const scheduleIdWhere = {
          id: payload.id,
        };

        const appointmentExist = await selectFirstData(
          practiceLink,
          "*",
          "schedule",
          scheduleIdWhere
        );

        if (appointmentExist && appointmentExist.isDeleted !== true) {
          const updatedScheduleData = {
            type: payload.type,
            isPatientNotifyViaSms: payload.isPatientNotifyViaSms,
            staffId: payload.staffId,
            isPractitionerNotifyViaSms: payload.isPractitionerNotifyViaSms,
            isPractitionerNotifyViaEmail: payload.isPractitionerNotifyViaEmail,
            scheduleDate: payload.scheduleDate,
            scheduleTime: payload.scheduleTime,
            duration: payload.duration,
            procedures: payload.procedures,
            notes: payload.notes,
            title: payload.title,
            isDeleted: false,
            updated_at: new Date(),
          };

          const updatedAppointmentData = {
            staffId: payload.staffId,
            scheduleDate: payload.scheduleDate,
            scheduleTime: payload.scheduleTime,
            duration: payload.duration,
            updated_at: new Date(),
          };

          const patientIdWhere = {
            id: payload.patientId,
          };
          const patientData = await selectFirstData(
            practiceLink,
            "*",
            "patients",
            patientIdWhere
          );

          updatedScheduleData.patientId = patientData.id;

          const result = await updateData(
            practiceLink,
            updatedScheduleData,
            ["*"],
            "schedule",
            scheduleIdWhere
          );

          const appointmentIdWhere = {
            scheduleId: result[0].id,
          };

          await updateData(
            practiceLink,
            updatedAppointmentData,
            ["*"],
            "appointments",
            appointmentIdWhere
          );

          if (result.length > 0) {
            if (
              appointmentExist.scheduleDate !== result[0].scheduleDate ||
              appointmentExist.scheduleTime !==
                result[0].scheduleTime.slice(0, -3) ||
              appointmentExist.duration !== result[0].duration
            ) {
              const where = {
                practiceLink,
              };
              const tenantExist = await selectFirstData(
                "public",
                "*",
                "tenants",
                where
              );

              const staffIdWhere = {
                id: payload.staffId,
              };
              const staffData = await selectFirstData(
                practiceLink,
                "*",
                "staff",
                staffIdWhere
              );

              if (payload.isPatientNotifyViaSms === true) {
                const userMeetingLink = result[0].meetingLink.split("?");
                await notifyStaffViaSms(
                  patientData.name,
                  payload.scheduleDate,
                  formatTime(payload.scheduleTime),
                  patientData.phone,
                  staffData.name,
                  tenantExist?.practiceName,
                  result[0].type,
                  "update",
                  userMeetingLink[0]
                );
              }

              if (payload.isPractitionerNotifyViaSms === true) {
                await notifyStaffViaSms(
                  staffData.name,
                  payload.scheduleDate,
                  formatTime(payload.scheduleTime),
                  staffData.phone,
                  null,
                  tenantExist?.practiceName,
                  result[0].type,
                  "update",
                  result[0].meetingLink
                );
              }
              if (payload.isPractitionerNotifyViaEmail === true) {
                const subject = "Appointment";
                await readNotifyStaffTemplate(
                  staffData.name,
                  payload.scheduleDate,
                  formatTime(payload.scheduleTime),
                  subject,
                  staffData.email,
                  tenantExist?.practiceName,
                  result[0].type,
                  "update",
                  result[0].meetingLink
                );
              }
            }
            return resolve(result);
          } else {
            return reject("Server error! Please try again");
          }
        } else {
          return reject("Appointment not found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update appointment date
async function updateAppointmentDateUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const appointmentIdWhere = {
          id: payload.id,
        };

        const appointmentExist = await selectFirstData(
          practiceLink,
          "*",
          "schedule",
          appointmentIdWhere
        );

        if (appointmentExist && appointmentExist.isDeleted !== true) {
          const updatedScheduleData = {
            scheduleDate: payload.newDate,
            updated_at: new Date(),
          };
          const result = await updateData(
            practiceLink,
            updatedScheduleData,
            ["*"],
            "schedule",
            appointmentIdWhere
          );

          await updateData(
            practiceLink,
            updatedScheduleData,
            ["*"],
            "appointments",
            appointmentIdWhere
          );

          if (result.length > 0) {
            const where = {
              practiceLink,
            };
            const tenantExist = await selectFirstData(
              "public",
              "*",
              "tenants",
              where
            );
            const patientWhere = {
              id: appointmentExist.patientId,
            };
            const patientData = await selectFirstData(
              practiceLink,
              "*",
              "patients",
              patientWhere
            );

            if (result[0].isPatientNotifyViaSms === true) {
              const userMeetingLink = result[0].meetingLink.split("?");
              await notifyStaffViaSms(
                patientData.name,
                result[0].scheduleDate,
                formatTime(result[0].scheduleTime),
                patientData.phone,
                null,
                tenantExist?.practiceName,
                result[0].type,
                "update",
                userMeetingLink[0],
                result[0].roomId
              );
            }
            if (
              result[0].isPractitionerNotifyViaSms === true ||
              result[0].isPractitionerNotifyViaEmail === true
            ) {
              const idWhere = {
                id: result[0].staffId,
              };
              const staffData = await selectFirstData(
                practiceLink,
                "*",
                "staff",
                idWhere
              );
              if (result[0].isPractitionerNotifyViaSms) {
                await notifyStaffViaSms(
                  staffData.name,
                  result[0].scheduleDate,
                  formatTime(result[0].scheduleTime),
                  staffData.phone,
                  null,
                  tenantExist?.practiceName,
                  result[0].type,
                  "update",
                  result[0].meetingLink,
                  result[0].roomId
                );
              }
              if (result[0].isPractitionerNotifyViaEmail === true) {
                const subject = "Appointment";
                await readNotifyStaffTemplate(
                  staffData.name,
                  result[0].scheduleDate,
                  formatTime(result[0].scheduleTime),
                  subject,
                  staffData.email,
                  tenantExist?.practiceName,
                  result[0].type,
                  "update",
                  result[0].meetingLink,
                  result[0].roomId
                );
              }
            }

            return resolve(result);
          }
        } else {
          return reject("Appointment doesn't exist");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to cancel appointment
async function cancelAppointmentUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const appointmentIdWhere = {
          id: payload.appointmentId,
        };

        const appointmentExist = await selectFirstData(
          practiceLink,
          "*",
          "schedule",
          appointmentIdWhere
        );

        if (appointmentExist && appointmentExist.isDeleted !== true) {
          const updatedScheduleData = {
            isDeleted: true,
          };

          const result = await updateData(
            practiceLink,
            updatedScheduleData,
            ["*"],
            "schedule",
            appointmentIdWhere
          );

          await updateData(
            practiceLink,
            updatedScheduleData,
            ["*"],
            "appointments",
            appointmentIdWhere
          );

          const patientWhere = {
            id: appointmentExist.patientId,
          };
          const patientData = await selectFirstData(
            practiceLink,
            "*",
            "patients",
            patientWhere
          );

          if (result.length > 0) {
            if (result[0].isPatientNotifyViaSms === true) {
              await notifyStaffViaSms(
                patientData.name,
                result[0].scheduleDate,
                formatTime(result[0].scheduleTime),
                patientData.phone,
                null,
                null,
                result[0].type,
                "cancel",
                null,
                null
              );
            }
            if (
              result[0].isPractitionerNotifyViaSms === true ||
              result[0].isPractitionerNotifyViaEmail === true
            ) {
              const idWhere = {
                id: result[0].staffId,
              };
              const staffData = await selectFirstData(
                practiceLink,
                "*",
                "staff",
                idWhere
              );
              if (result[0].isPractitionerNotifyViaSms) {
                await notifyStaffViaSms(
                  staffData.name,
                  result[0].scheduleDate,
                  formatTime(result[0].scheduleTime),
                  staffData.phone,
                  null,
                  null,
                  result[0].type,
                  "cancel",
                  null,
                  null
                );
              }
              if (result[0].isPractitionerNotifyViaEmail === true) {
                const subject = "Appointment";
                await readNotifyStaffTemplate(
                  staffData.name,
                  result[0].scheduleDate,
                  formatTime(result[0].scheduleTime),
                  subject,
                  staffData.email,
                  null,
                  result[0].type,
                  "cancel",
                  null,
                  null
                );
              }
            }
            return resolve(result);
          }
        } else {
          return reject(
            "This appointment cannot be deleted, Please contact Administrator"
          );
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//  Function to get appointment
async function getAllAppointmentsUser(userId, practiceLink) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const data = await selectAllDataMultipleJoin(
          practiceLink,
          "patients",
          "schedule.patientId",
          "=",
          "patients.id",
          "staff",
          "schedule.staffId",
          "=",
          "staff.id",
          "schedule.*",
          knex.raw(
            "json_build_object('firstName', patients.\"firstName\", 'lastName', patients.\"lastName\", 'mrn', patients.\"mrn\") as patientsData"
          ),
          knex.raw("json_build_object('name', staff.name) as staffData"),
          "schedule"
        );

        const filterData = data.filter((item) => item.type === "video");
        return resolve(filterData);
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

//  Function to get appointment
async function getInstantMeetingUser(
  userId,
  loginUserId,
  userType,
  practiceLink
) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const where = {
          id: loginUserId,
        };

        if (userType === "admin") {
          const tenantExist = await selectFirstData(
            "public",
            "*",
            "tenants",
            where
          );

          if (tenantExist && tenantExist.isDeleted != true) {
            const responseData = {
              instantMeetingLink: tenantExist.instantMeetingLink,
            };
            return resolve(responseData);
          } else {
            return reject("Invalid user");
          }
        } else {
          const staffExist = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            where
          );
          if (staffExist && staffExist.isDeleted != true) {
            const responseData = {
              instantMeetingLink: staffExist.instantMeetingLink,
            };
            return resolve(responseData);
          } else {
            return reject("Invalid user");
          }
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update appointment
async function updateInstantMeetingUser(
  userId,
  loginUserId,
  practiceLink,
  payload
) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const updatedData = {
          instantMeetingLink: payload.instantMeetingLink,
        };
        const where = {
          id: loginUserId,
        };

        if (payload.userType === "admin") {
          const tenantExist = await selectFirstData(
            "public",
            "*",
            "tenants",
            where
          );
          if (tenantExist && tenantExist.isDeleted != true) {
            const result = await updateData(
              "public",
              updatedData,
              ["id", "instantMeetingLink"],
              "tenants",
              where
            );
            if (result.length > 0) {
              return resolve(result);
            }
          } else {
            return reject("Invalid user");
          }
        } else {
          const staffExist = await selectFirstData(
            practiceLink,
            "*",
            "staff",
            where
          );
          if (staffExist && staffExist.isDeleted != true) {
            const result = await updateData(
              practiceLink,
              updatedData,
              ["id", "instantMeetingLink"],
              "staff",
              where
            );
            if (result.length > 0) {
              return resolve(result);
            }
          } else {
            return reject("Invalid user");
          }
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update appointment status
async function updateAppointmentStatusUser(userId, practiceLink, payload) {
  return new Promise(async function (resolve, reject) {
    try {
      if (await isUserExist(userId)) {
        const scheduleIdWhere = {
          id: payload.id,
        };

        const scheduleExist = await selectFirstData(
          practiceLink,
          "*",
          "schedule",
          scheduleIdWhere
        );

        if (scheduleExist && scheduleExist.isDeleted !== true) {
          const updatedScheduleData = {
            status: payload.status,
            updated_at: new Date(),
          };

          const result = await updateData(
            practiceLink,
            updatedScheduleData,
            ["*"],
            "schedule",
            scheduleIdWhere
          );

          const appointmentIdWhere = {
            scheduleId: result[0].id,
          };

          const appointmentExist = await selectFirstData(
            practiceLink,
            "*",
            "appointments",
            appointmentIdWhere
          );

          if (appointmentExist && appointmentExist.isDeleted !== true) {
            await updateData(
              practiceLink,
              updatedScheduleData,
              ["*"],
              "appointments",
              appointmentIdWhere
            );

            if (result.length > 0) {
              return resolve(result);
            } else {
              return reject("Server error! Please try again");
            }
          } else {
            return reject("Appointment not found");
          }
        } else {
          return reject("Appointment not found");
        }
      } else {
        return reject("No user found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
