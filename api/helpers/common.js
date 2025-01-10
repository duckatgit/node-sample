const jwt = require("jsonwebtoken");
const config = require("../helpers/config.json");

module.exports = {
  createToken,
  verifyToken,
};

// Function to create jwt token
async function createToken(data, duration) {
  return new Promise(async function (resolve, reject) {
    try {
      if (duration) {
        const token = jwt.sign(data, config.secret, { expiresIn: duration });
        return resolve(token);
      } else {
        const token = jwt.sign(data, config.secret);
        return resolve(token);
      }
    } catch (error) {
      return reject(error);
    }
  });
}

// Function to verify jwt token
async function verifyToken(token) {
  return new Promise(async function (resolve, reject) {
    try {
      const decoded = jwt.verify(token, config.secret);
      return resolve(decoded);
    } catch (error) {
      return reject(error);
    }
  });
}
