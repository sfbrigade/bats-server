const express = require("express");
const HttpStatus = require("http-status-codes");

const router = express.Router();

router.use("/users", require("./users"));

router.get("/health", function(req, res, next) {
  res.status(HttpStatus.NO_CONTENT).end();
});

module.exports = router;
