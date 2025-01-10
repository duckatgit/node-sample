const knex = require("../config/db");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const {
  readVerifyEmailTemplate,
  readVerificationCodeTemplate,
  readInviteStaffTemplate,
} = require("../services/emailService");
const { verifyToken, createToken } = require("../helpers/common");
const {
  selectFirstData,
  insertData,
  createSchema,
  createTenantTables,
  updateData,
} = require("./dbService");
const { getRandomNumber } = require("./commonService");
const { sendCodeInNumber } = require("./twillioService");

module.exports = {
  checkDuplicateUser,
  createUserAccount,
  verifyPracticeLink,
  verifyUserAccount,
  resendVerifyLink,
  sendUserVerificationCode,
  verifyUserCode,
  userCodeTimeout,
  changeUserPassword,
  loginUser,
};

// Function to check duplicate email
async function checkDuplicateUser(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const emailExist = await knex("tenants")
        .where({
          email: payload.email.toLowerCase(),
        })
        .select("*")
        .first();

      const phoneExist = await knex("tenants")
        .where({
          phone: payload.phone,
        })
        .select("*")
        .first();
      if (emailExist || phoneExist) {
        if (emailExist) {
          return reject("Email already registered!");
        }
        if (phoneExist) {
          return reject("Phone Number already registered!");
        }
      } else {
        return resolve(true);
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to create account
async function createUserAccount(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const emailWhere = {
        email: payload.email.toLowerCase(),
      };
      const userExist = await selectFirstData(
        "public",
        "*",
        "tenants",
        emailWhere
      );
      if (userExist) {
        return reject("Email already registered!");
      } else {
        let practiceName = payload.practiceName
          ? payload.practiceName.trim()
          : "";
        const practiceWhere = {
          practiceName: practiceName,
        };
        const userData = await selectFirstData(
          "public",
          "*",
          "tenants",
          practiceWhere
        );
        if (userData) {
          return reject("Practice Name already Exists!");
        } else {
          let practiceLink = payload.practiceLink
            ? payload.practiceLink.trim()
            : "";
          practiceLink = practiceLink.toLowerCase();

          const encryptedPassword = await bcrypt.hash(payload.password, salt);
          const insertTenant = {
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email.toLowerCase(),
            password: encryptedPassword,
            phone: payload.phone,
            practiceName: practiceName,
            practiceLink: practiceLink,
            isAgree: payload.isAgree,
            isVerified: false,
            timeout: 1800,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          const result = await insertData(
            "public",
            insertTenant,
            ["id", "email"],
            "tenants"
          );
          if (result.length > 0) {
            const schemaResult = await createSchema(practiceLink);
            if (schemaResult) {
              const tableResult = await createTenantTables(practiceLink);
              if (tableResult) {
                const data = result[0];
                const userName = `${payload.firstName} ${payload.lastName}`;
                const subject = "Verify Account";
                const emailRes = await readVerifyEmailTemplate(
                  data.id,
                  userName,
                  data.email,
                  practiceLink,
                  subject
                );
                if (emailRes) {
                  return resolve(emailRes);
                } else {
                  return reject("Server error!");
                }
              } else {
                return reject("Server error!");
              }
            }
          } else {
            return reject("Server error!");
          }
        }
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to Verify Practice Link
async function verifyPracticeLink(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      let practiceLink = payload.practiceLink
        ? payload.practiceLink.trim()
        : "";
      practiceLink = practiceLink.toLowerCase();
      const link = await knex("tenants")
        .where({
          practiceLink: practiceLink,
        })
        .select("*")
        .first();
      if (link) {
        return reject("Practice Link already Exist!");
      } else {
        return resolve(true);
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to Verify User Account
async function verifyUserAccount(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const userData = await knex("tenants")
        .where({
          id: payload.id,
        })
        .select("*")
        .first();

      if (userData) {
        if (userData.isVerified === true) {
          return reject("Link already used!");
        } else {
          const result = await verifyToken(payload.token);
          if (result) {
            const updateRes = await knex("tenants")
              .where({ id: payload.id })
              .update({
                isVerified: true,
              });
            if (updateRes) {
              return resolve({ practiceLink: userData.practiceLink });
            } else {
              return reject("Something went wrong!");
            }
          } else {
            return reject("Token is invalid!");
          }
        }
      } else {
        return reject("User not found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to resend verify link
async function resendVerifyLink(payload) {
  return new Promise(async function (resolve, reject) {
    try {
      const userData = await knex("tenants")
        .where({
          email: payload.email.toLowerCase(),
        })
        .select("*")
        .first();
      if (userData) {
        const userName = `${userData.firstName} ${userData.lastName}`;
        const subject = "Verify Account";
        const emailRes = await readVerifyEmailTemplate(
          userData.id,
          userName,
          userData.email,
          userData.practiceLink,
          subject
        );
        return resolve(emailRes);
      } else {
        return reject("User not found!");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to send Verification Code
async function sendUserVerificationCode(payload, origin) {
  return new Promise(async function (resolve, reject) {
    try {
      // For local login
      let originName = origin;
      if (originName.includes("localhost")) {
        originName = "http://testpractice.treo.cloud";
      }

      const originData = originName ? originName.split(".") : [];
      if (originData.length === 3) {
        const practiceLinkOrigin = originData[0];
        const practiceLinkData = practiceLinkOrigin
          ? practiceLinkOrigin.split("//")
          : [];
        const practiceLink = practiceLinkData[1];

        let where = {};
        if (payload.type === "email") {
          where = { email: payload.email.toLowerCase() };
        }
        if (payload.type === "phone") {
          where = { phone: payload.phone };
        }

        const userExist = await knex("tenants")
          .where(where)
          .select("*")
          .first();

        if (userExist) {
          const userId = userExist.id;
          const userName = `${userExist.firstName} ${userExist.lastName}`;
          const code = await getRandomNumber(100000, 900000);
          let isCodeSent = false;

          if (payload.type === "email") {
            const subject = "Reset Password Code";
            const emailRes = await readVerificationCodeTemplate(
              userName,
              code,
              payload.email.toLowerCase(),
              subject
            );

            if (emailRes) {
              isCodeSent = true;
            } else {
              return reject("Server error!");
            }
          }
          if (payload.type === "phone") {
            const messageRes = await sendCodeInNumber(
              userName,
              code,
              payload.phone
            );
            if (messageRes) {
              isCodeSent = true;
            } else {
              return reject("Server error!");
            }
          }
          if (isCodeSent === true) {
            const updateRes = await knex("tenants")
              .where({ id: userId })
              .update({
                verificationCode: code,
                isCodeTimeout: false,
              });
            if (updateRes) {
              return resolve(true);
            } else {
              return reject("Something went wrong!");
            }
          } else {
            return reject("Server error!");
          }
        } else {
          const schemaExist = await knex("tenants")
            .where({
              practiceLink: practiceLink,
            })
            .select("*")
            .first();

          if (schemaExist) {
            const staffExist = await selectFirstData(
              practiceLink,
              "*",
              "staff",
              where
            );

            if (staffExist) {
              const staffId = staffExist.id;
              const staffName = staffExist.name;
              const code = await getRandomNumber(100000, 900000);
              let isCodeSent = false;

              if (payload.type === "email") {
                const subject = "Reset Password Code";
                const emailRes = await readVerificationCodeTemplate(
                  staffName,
                  code,
                  payload.email.toLowerCase(),
                  subject
                );

                if (emailRes) {
                  isCodeSent = true;
                } else {
                  return reject("Server error!");
                }
              }
              if (payload.type === "phone") {
                const messageRes = await sendCodeInNumber(
                  staffName,
                  code,
                  payload.phone
                );
                if (messageRes) {
                  isCodeSent = true;
                } else {
                  return reject("Server error!");
                }
              }

              if (isCodeSent === true) {
                const staffUpdateData = {
                  verificationCode: code,
                  isCodeTimeout: false,
                };
                const staffWhere = { id: staffId };

                const updateRes = await updateData(
                  practiceLink,
                  staffUpdateData,
                  ["id", "email"],
                  "staff",
                  staffWhere
                );

                if (updateRes) {
                  return resolve(true);
                } else {
                  return reject("Something went wrong!");
                }
              } else {
                return reject("Server error!");
              }
            } else {
              return reject("Wrong Email Address!");
            }
          } else {
            reject("Login URL is invalid! Please contact with Administrator");
          }
        }
      } else {
        return reject("Unauthorized! Please contact with Administrator");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to verify verification code
async function verifyUserCode(payload, origin) {
  return new Promise(async function (resolve, reject) {
    try {
      // For local login
      let originName = origin;
      if (originName.includes("localhost")) {
        originName = "http://testpractice.treo.cloud";
      }

      const originData = originName ? originName.split(".") : [];
      if (originData.length === 3) {
        const practiceLinkOrigin = originData[0];
        const practiceLinkData = practiceLinkOrigin
          ? practiceLinkOrigin.split("//")
          : [];
        const practiceLink = practiceLinkData[1];

        let where = {};
        if (payload.type === "email") {
          where = { email: payload.email.toLowerCase() };
        }
        if (payload.type === "phone") {
          where = { phone: payload.phone };
        }
        const userExist = await knex("tenants")
          .where(where)
          .select("*")
          .first();
        if (userExist) {
          if (userExist.verificationCode) {
            if (userExist.verificationCode === payload.code) {
              return resolve(true);
            } else {
              return reject("Invalid Code!");
            }
          } else {
            return reject("Something went wrong!");
          }
        } else {
          const schemaExist = await knex("tenants")
            .where({
              practiceLink: practiceLink,
            })
            .select("*")
            .first();

          if (schemaExist) {
            const staffExist = await selectFirstData(
              practiceLink,
              "*",
              "staff",
              where
            );

            if (staffExist) {
              if (staffExist.verificationCode) {
                if (staffExist.verificationCode === payload.code) {
                  return resolve(true);
                } else {
                  return reject("Invalid Code!");
                }
              } else {
                return reject("Something went wrong!");
              }
            } else {
              return reject("Something went wrong!");
            }
          } else {
            reject("Login URL is invalid! Please contact with Administrator");
          }
        }
      } else {
        return reject("Unauthorized! Please contact with Administrator");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to update verification code timeout
async function userCodeTimeout(payload, origin) {
  return new Promise(async function (resolve, reject) {
    try {
      // For local login
      let originName = origin;
      if (originName.includes("localhost")) {
        originName = "http://testpractice.treo.cloud";
      }

      const originData = originName ? originName.split(".") : [];
      if (originData.length === 3) {
        const practiceLinkOrigin = originData[0];
        const practiceLinkData = practiceLinkOrigin
          ? practiceLinkOrigin.split("//")
          : [];
        const practiceLink = practiceLinkData[1];

        let where = {};
        if (payload.type === "email") {
          where = { email: payload.email.toLowerCase() };
        }
        if (payload.type === "phone") {
          where = { phone: payload.phone };
        }

        const userExist = await knex("tenants")
          .where(where)
          .select("*")
          .first();

        if (userExist) {
          const updateRes = await knex("tenants").where(where).update({
            isCodeTimeout: true,
          });
          if (updateRes) {
            return resolve(true);
          } else {
            return reject("Something went wrong!");
          }
        } else {
          const schemaExist = await knex("tenants")
            .where({
              practiceLink: practiceLink,
            })
            .select("*")
            .first();

          if (schemaExist) {
            const staffExist = await selectFirstData(
              practiceLink,
              "*",
              "staff",
              where
            );

            if (staffExist) {
              const staffUpdateData = {
                isCodeTimeout: true,
              };

              const updateRes = await updateData(
                practiceLink,
                staffUpdateData,
                ["id", "email"],
                "staff",
                where
              );

              if (updateRes) {
                return resolve(true);
              } else {
                return reject("Something went wrong!");
              }
            } else {
              return reject("Something went wrong!");
            }
          } else {
            reject("Login URL is invalid! Please contact with Administrator");
          }
        }
      } else {
        return reject("Unauthorized! Please contact with Administrator");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to change user password
async function changeUserPassword(payload, origin) {
  return new Promise(async function (resolve, reject) {
    try {
      // For local login
      let originName = origin;
      if (originName.includes("localhost")) {
        originName = "http://testpractice.treo.cloud";
      }

      const originData = originName ? originName.split(".") : [];
      if (originData.length === 3) {
        const practiceLinkOrigin = originData[0];
        const practiceLinkData = practiceLinkOrigin
          ? practiceLinkOrigin.split("//")
          : [];
        const practiceLink = practiceLinkData[1];

        let where = {};
        if (payload.type === "email") {
          where = { email: payload.email.toLowerCase() };
        }
        if (payload.type === "phone") {
          where = { phone: payload.phone };
        }
        const userExist = await knex("tenants")
          .where(where)
          .select("*")
          .first();
        if (userExist) {
          const comparePassword = await bcrypt.compare(
            payload.password,
            userExist.password
          );
          if (!comparePassword) {
            const encryptedPassword = await bcrypt.hash(payload.password, salt);
            const updateRes = await knex("tenants").where(where).update({
              password: encryptedPassword,
              isResetPassword: true,
              updatedAt: new Date(),
            });
            if (updateRes) {
              return resolve(true);
            } else {
              return reject("Something went wrong!");
            }
          } else {
            return reject("New password cannot be same as old password");
          }
        } else {
          const schemaExist = await knex("tenants")
            .where({
              practiceLink: practiceLink,
            })
            .select("*")
            .first();

          if (schemaExist) {
            const staffExist = await selectFirstData(
              practiceLink,
              "*",
              "staff",
              where
            );

            if (staffExist) {
              const comparePassword = await bcrypt.compare(
                payload.password,
                staffExist.password
              );
              if (!comparePassword) {
                const encryptedPassword = await bcrypt.hash(
                  payload.password,
                  salt
                );
                const staffUpdateData = {
                  password: encryptedPassword,
                  isResetPassword: true,
                  updated_at: new Date(),
                };
                const updateRes = await updateData(
                  practiceLink,
                  staffUpdateData,
                  ["id", "email"],
                  "staff",
                  where
                );
                if (updateRes) {
                  return resolve(true);
                } else {
                  return reject("Something went wrong!");
                }
              } else {
                return reject("New password cannot be same as old password");
              }
            } else {
              return reject("Something went wrong!");
            }
          } else {
            reject("Login URL is invalid! Please contact with Administrator");
          }
        }
      } else {
        return reject("Unauthorized! Please contact with Administrator");
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to login user
async function loginUser(payload, origin) {
  return new Promise(async function (resolve, reject) {
    try {
      // For local login
      let originName = origin;
      if (originName.includes("localhost")) {
        originName = "http://testpractice.treo.cloud";
      }

      const originData = originName ? originName.split(".") : [];
      if (originData.length === 3) {
        const practiceLinkOrigin = originData[0];
        const practiceLinkData = practiceLinkOrigin
          ? practiceLinkOrigin.split("//")
          : [];
        const practiceLink = practiceLinkData[1];
        const userExist = await knex("tenants")
          .where({
            email: payload.email.toLowerCase(),
          })
          .select("*")
          .first();

        if (userExist) {
          if (userExist.practiceLink === practiceLink) {
            const isPasswordMatch = await bcrypt.compare(
              payload.password,
              userExist.password
            );
            if (isPasswordMatch) {
              if (userExist.isVerified === true) {
                const data = {
                  userId: userExist.id,
                  email: userExist.email,
                  userName: `${userExist.firstName} ${userExist.lastName}`,
                  practiceName: userExist.practiceName,
                  practiceLink: userExist.practiceLink,
                  type: "admin",
                  access: "administrator",
                  loginUserId: userExist.id,
                };
                const token = await createToken(data, null);
                data.token = token;
                const res = {
                  success: true,
                  data: data,
                };
                return resolve(res);
              } else {
                const userName = `${userExist.firstName} ${userExist.lastName}`;
                const subject = "Verify Account";
                const emailRes = await readVerifyEmailTemplate(
                  userExist.id,
                  userName,
                  payload.email.toLowerCase(),
                  userExist.practiceLink,
                  subject
                );
                if (emailRes) {
                  const res = {
                    success: false,
                    data: { type: "owner" },
                  };
                  return resolve(res);
                } else {
                  return reject("Server error!");
                }
              }
            } else {
              return reject("Wrong Password!");
            }
          } else {
            return reject("Unauthorized! Please use your Login Url");
          }
        } else {
          const schemaExist = await knex("tenants")
            .where({
              practiceLink: practiceLink,
            })
            .select("*")
            .first();

          if (schemaExist) {
            const emailWhere = {
              email: payload.email.toLowerCase(),
            };
            const staffExist = await selectFirstData(
              practiceLink,
              "*",
              "staff",
              emailWhere
            );

            if (staffExist) {
              if (staffExist.status === "inactive") {
                return reject(
                  "Your account is deactivated. Please contact with Administrator"
                );
              }
              if (staffExist.isVerified && staffExist.password) {
                const isPasswordMatch = await bcrypt.compare(
                  payload.password,
                  staffExist.password
                );
                if (isPasswordMatch) {
                  const data = {
                    userId: staffExist.userId,
                    email: staffExist.email,
                    userName: staffExist.name,
                    practiceLink: practiceLink,
                    type: staffExist.type,
                    access: staffExist.treoAccess,
                    loginUserId: staffExist.id,
                  };
                  const token = await createToken(data, null);
                  data.token = token;
                  const res = {
                    success: true,
                    data: data,
                  };
                  return resolve(res);
                } else {
                  return reject("Wrong Password!");
                }
              } else {
                const subject = "Welcome to Treo!";
                const emailRes = await readInviteStaffTemplate(
                  staffExist.id,
                  staffExist.name,
                  staffExist.email,
                  practiceLink,
                  subject
                );
                if (emailRes) {
                  const res = {
                    success: false,
                    data: { type: "practitioner" },
                  };
                  return resolve(res);
                } else {
                  return reject("Server error! Please try again");
                }
              }
            } else {
              return reject("Wrong Email Address!");
            }
          } else {
            reject("Login URL is invalid! Please contact with Administrator");
          }
        }
      } else {
        return reject("Unauthorized! Please contact with Administrator");
      }
    } catch (error) {
      return reject(error);
    }
  });
}
