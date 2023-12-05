const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');

const router = express.Router();

router.get('/', passport.authenticate('peak'));

router.get('/callback', (req, res, next) => {
  passport.authenticate('peak', (err, user) => {
    if (err) {
      if (req.accepts('html')) {
        res.redirect('/auth/peak');
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      }
    } else if (user) {
      req.login(user, () => {
        req.session.twoFactor = true;
        if (req.accepts('html')) {
          res.redirect('/');
        } else {
          res.status(HttpStatus.OK).end();
        }
      });
    } else if (req.accepts('html')) {
      res.redirect('/auth/peak');
    } else {
      res.status(HttpStatus.UNAUTHORIZED).end();
    }
  })(req, res, next);
});

module.exports = router;
