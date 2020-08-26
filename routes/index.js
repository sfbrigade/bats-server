var express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
var router = express.Router();

router.use("/api", require("./api"));
router.post("/login", authController.loginPost);
router.post("/logout", authController.logout);

module.exports = router;
