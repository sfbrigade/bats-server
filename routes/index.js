var express = require("express");
var router = express.Router();
const authController = require("../controllers/authController");

router.use("/api", require("./api"));
router.use("/auth", require("./auth"));
router.post("/user", authController.createUser); // TODO - move somewhere else

module.exports = router;
