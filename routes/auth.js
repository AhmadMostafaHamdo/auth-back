const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  refresh,
  logout,
} = require("../controller/authController");
router.post("/register", registerController);
router.post("/login", loginController);
router.get("/refresh", refresh);
router.post('/logout',logout)
module.exports = router;
