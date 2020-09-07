const express = require("express");
const HttpStatus = require("http-status-codes");

const router = express.Router();

router.get("/health", function (req, res) {
  res.status(HttpStatus.NO_CONTENT).end();
});

module.exports = router;
