const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');

const router = express.Router();

router.get('/login', function (req, res, next) {
  res.render('auth/local/login');
});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.log(err);
    } else if (user) {
      req.login(user, function () {
        if (req.accepts('html')) {
          res.redirect('/');
        } else {
          res.status(HttpStatus.OK).end();
        }
      });
    } else {
      if (req.accepts('html')) {
        res.render('auth/local/login', {
          unauthorized: true,
          username: req.body.username,
        });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).end();
      }
    }
  })(req, res, next);
});

router.get('/logout', function (req, res, next) {
  req.logout();
  if (req.accepts('html')) {
    res.redirect('/');
  } else {
    res.status(HttpStatus.OK).end();
  }
});

module.exports = router;
