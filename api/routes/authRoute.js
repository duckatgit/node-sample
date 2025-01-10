const express = require("express");
const router = express.Router();
const {
  checkDuplicate,
  createAccount,
  verifyLink,
  verifyAccount,
  resendLink,
  sendVerificationCode,
  verifyCode,
  codeTimeout,
  changePassword,
  login,
} = require("../controllers/authController");

router.post("/check-duplicate-user", checkDuplicate);
router.post("/create-account", createAccount);
router.post("/verify-link", verifyLink);
router.get("/verify-account/:token/:id", verifyAccount);
router.post("/resend-link", resendLink);
router.post("/send-verification-code", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/code-timeout", codeTimeout);
router.post("/change-password", changePassword);
router.post("/login", login);

module.exports = router;
