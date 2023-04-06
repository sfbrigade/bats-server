const HttpStatus = require('http-status-codes');

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    // ensure authenticated user is active
    if (!req.user.isActive) {
      res.status(HttpStatus.FORBIDDEN).end();
    } else if (!req.session.twoFactor) {
      res.status(HttpStatus.UNAUTHORIZED).end();
    } else {
      next();
    }
  } else if (req.accepts('html')) {
    res.redirect('/auth/local/login');
  } else {
    res.status(HttpStatus.UNAUTHORIZED).end();
  }
};

const isSuperUser = (req, res, next) => {
  if (req.user?.isSuperUser) {
    next();
  } else if (req.accepts('html')) {
    res.redirect('/auth/local/login');
  } else if (req.user) {
    res.status(HttpStatus.FORBIDDEN).end();
  } else {
    res.status(HttpStatus.UNAUTHORIZED).end();
  }
};

const isAdminUser = (req, res, next) => {
  if (req.user?.isSuperUser || req.user?.isAdminUser) {
    next();
  } else if (req.accepts('html')) {
    res.redirect('/auth/local/login');
  } else if (req.user) {
    res.status(HttpStatus.FORBIDDEN).end();
  } else {
    res.status(HttpStatus.UNAUTHORIZED).end();
  }
};
module.exports = {
  isAuthenticated,
  isSuperUser,
  isAdminUser,
};
