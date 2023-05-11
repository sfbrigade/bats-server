const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
const router = express.Router();

router.get('/login', (req, res) => {
  // If user is already logged in and two Factor authenticated then redirect to home page
  if (req.session.twoFactor) {
    res.redirect('/');
  } else {
    // Check if user is already logged in through passport, if so, log them out
    if (req.user) req.logout();
    res.render('auth/local/login');
  }
});

router.get('/twoFactor', async (req, res) => {
  if (req.session.twoFactor) {
    res.redirect('/');
  } else if (req.user) {
    await req.user.generateToTPSecret();
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

router.post('/twoFactor', async (req, res) => {
  // Redirect if Session is interrupted
  if (req.user) {
    const verified = await req.user.verifyTwoFactor(req);
    // If the code is verified, set the session to twoFactor and redirect to home page
    if (verified) {
      req.session.twoFactor = true;
      res.redirect('/');
    } else {
      res.render('auth/local/twoFactor', { incorrectCode: true });
    }
  } else {
    res.redirect('/auth/local/login');
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
