const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');

const router = express.Router();

router.get('/login', async (req, res) => {
  res.render('auth/local/login');
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      if (req.accepts('html')) {
        res.render('auth/local/login', {
          // TODO: pass error?
          username: req.body.username,
        });
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
      res.render('auth/local/login', {
        unauthorized: true,
        username: req.body.username,
      });
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

module.exports = router;
