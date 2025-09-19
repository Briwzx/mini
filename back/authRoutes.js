const express = require("express");
const router = express.Router();
const { register, login, resetPassword } = require("./authController");

router.post("/register", register);
router.post("/login", login);
router.post("/reset", resetPassword);

module.exports = router;
