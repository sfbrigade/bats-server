const HttpStatus = require('http-status-codes');

const isAuthenticated = function (req, res, next) {
  if (req.user) {
    next();
  } else {
    if (req.accepts('html')) {
      res.redirect('/auth/local/login');
    } else {
      res.status(HttpStatus.UNAUTHORIZED).end();
    }
  }
};

const isSuperUser = function (req, res, next) {
  if (req.user?.isSuperUser) {
    next();
  } else {
    if (req.accepts('html')) {
      res.redirect('/auth/local/login');
    } else {
      if (req.user) {
        res.status(HttpStatus.FORBIDDEN).end();
      } else {
        res.status(HttpStatus.UNAUTHORIZED).end();
      }
    }
  }
};

module.exports = {
  isAuthenticated,
  isSuperUser,
};
