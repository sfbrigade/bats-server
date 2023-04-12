const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      // send error message to front end
      if (req.accepts('html')) {
        res.redirect(`/login/?user=${req.body.username}&error=failed`);
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
      }
    } else if (user) {
      req.login(user, () => {
        if (req.accepts('html')) {
          res.redirect('/');
        } else {
          res.status(HttpStatus.OK).end();
        }
      });
    } else if (req.accepts('html')) {
      res.redirect(`/login/?user=${req.body.username}&error=unauthorized`);
    } else {
      res.status(HttpStatus.UNAUTHORIZED).end();
    }
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  if (req.accepts('html')) {
    res.redirect('/');
  } else {
    res.status(HttpStatus.OK).end();
  }
});

router.post('/reset', (req, res) => {
  console.log(req.body.email);
  res.redirect('/');
});

module.exports = router;
