const express = require("express");
const HttpStatus = require("http-status-codes");
const passport = require("passport");

const router = express.Router();

router.post("/login", passport.authenticate("local"), function (req, res, next) {
  if (req.accepts("json")) {
    res.status(HttpStatus.OK).end();
  } else {
    res.redirect("/");
  }
});

router.post("/logout", function (req, res, next) {
  req.logout();
  if (req.accepts("json")) {
    res.status(HttpStatus.OK).end();
  } else {
    res.redirect("/login");
  }
});

module.exports = router;
