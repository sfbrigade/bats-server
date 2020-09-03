const express = require("express");
const HttpStatus = require("http-status-codes");
const passport = require("passport");
const authController = require("../../controllers/authController");

const router = express.Router();

router.post("/login", passport.authenticate("local"), authController.loginPost);
router.post("/logout", authController.logoutPost);

module.exports = router;
