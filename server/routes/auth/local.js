const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
const router = express.Router();
const { generateToTPSecret } = require('../helpers');
const notp = require('notp');

router.get('/login', (req, res) => {
  if (req.session.twoFactor) {
    res.redirect('/');
  } else res.render('auth/local/login');
});

router.get('/twoFactor', async (req, res) => {
  if (req.session.twoFactor) {
    res.redirect('/');
  } else if (req.user) {
    generateToTPSecret(req);
    res.render('auth/local/twoFactor');
  } else {
    res.redirect('/auth/local/login');
  }
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
          res.redirect('/auth/local/twoFactor');
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

router.post('/twoFactor', (req, res) => {
  const key = req.session.totpKey;
  const token = req.body.code;
  const verified = notp.totp.verify(token, key, { window: 30 });
  if (verified) {
    req.session.twoFactor = true;
    res.redirect('/');
  } else {
    res.render('auth/local/twoFactor', { incorrectCode: true });
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  req.session.twoFactor = false;
  if (req.accepts('html')) {
    res.redirect('/');
  } else {
    res.status(HttpStatus.OK).end();
  }
});

module.exports = router;
