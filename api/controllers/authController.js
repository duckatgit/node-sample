const { failAction, successAction } = require("../utils/response");
const {
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
} = require("../services/authService");

// Function to check duplicate email
exports.checkDuplicate = async function (req, res) {
  const payload = req.body;
  try {
    const isValid = await checkDuplicateUser(payload);
    res.status(200).json(successAction(isValid, "User is Valid"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to create account
exports.createAccount = async function (req, res) {
  const payload = req.body;
  try {
    const user = await createUserAccount(payload);
    res.status(200).json(successAction(user, "Account Created Successfully!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Verify Practice Link
exports.verifyLink = async function (req, res) {
  const payload = req.body;
  try {
    const isValid = await verifyPracticeLink(payload);
    res.status(200).json(successAction(isValid, "Practice Link is Valid!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Verify Account
exports.verifyAccount = async function (req, res) {
  const payload = req.params;
  try {
    const result = await verifyUserAccount(payload);
    res
      .status(200)
      .json(successAction(result, "Account Verified Successfully!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Resend Verify Link
exports.resendLink = async function (req, res) {
  const payload = req.params;
  try {
    const data = await resendVerifyLink(payload);
    res
      .status(200)
      .json(successAction(data, "Resend Verify Link Successfully!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Send Verification Code
exports.sendVerificationCode = async function (req, res) {
  const payload = req.body;
  const origin = req.headers.origin;
  try {
    const data = await sendUserVerificationCode(payload, origin);
    res
      .status(200)
      .json(successAction(data, "Verification Code sent Successfully!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to Verify Verification Code
exports.verifyCode = async function (req, res) {
  const payload = req.body;
  const origin = req.headers.origin;
  try {
    const data = await verifyUserCode(payload, origin);
    res.status(200).json(successAction(data, "Code Verified Successfully!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to update timeout Verification Code
exports.codeTimeout = async function (req, res) {
  const payload = req.body;
  const origin = req.headers.origin;
  try {
    const data = await userCodeTimeout(payload, origin);
    res.status(200).json(successAction(data, "Timeout updated Successfully!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to change password
exports.changePassword = async function (req, res) {
  const payload = req.body;
  const origin = req.headers.origin;
  try {
    const data = await changeUserPassword(payload, origin);
    res.status(200).json(successAction(data, "Password changed Successfully!"));
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};

// Function to login
exports.login = async function (req, res) {
  const payload = req.body;
  const origin = req.headers.origin;
  try {
    const result = await loginUser(payload, origin);
    if (result.success) {
      res
        .status(200)
        .json(successAction(result.data, "User Login Successfullly!", true));
    } else {
      res
        .status(200)
        .json(successAction(result.data, "Account is Not Verified!", false));
    }
  } catch (error) {
    res.status(400).json(failAction(error));
  }
};
