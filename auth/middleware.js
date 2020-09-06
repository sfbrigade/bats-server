const HttpStatus = require("http-status-codes");

const isAuthenticated = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    if (req.accepts("json")) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else {
      res.redirect("/login");
    }
  }
};

const isSuperUser = function (req, res, next) {
  if (req.user?.isSuperUser) {
    next();
  } else {
    if (req.accepts("json")) {
      if (req.user) {
        res.status(HttpStatus.FORBIDDEN).end();
      } else {
        res.status(HttpStatus.UNAUTHORIZED).end();
      }
    } else {
      res.redirect("/login");
    }
  }
};

module.exports = {
  isAuthenticated,
  isSuperUser
};
