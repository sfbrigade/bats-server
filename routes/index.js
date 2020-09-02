var express = require("express");
const passport = require("passport");
const authController = require("../controllers/authController");
var router = express.Router();

router.use("/api", require("./api"));
router.post("/login", passport.authenticate("local"), authController.loginPost);
router.post("/logout", authController.logoutPost);
router.post("/user", authController.createUser); // TODO - move somewhere else

module.exports = router;
