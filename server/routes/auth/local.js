const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
const router = express.Router();
const models = require('../../models');

router.get('/login', (req, res) => {
  // If user is already logged in and two Factor authenticated then redirect to home page
  if (req.session.twoFactor) {
    res.redirect('/');
  } else {
    // Check if user is already logged in through passport, if so, log them out
    if (req.user) {
      req.logout();
    }
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
        res.redirect(`/login/?user=${req.body.username}&error=failed`);
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
      res.redirect(`/login/?user=${req.body.username}&error=unauthorized`);
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

router.post('/reset', async (req, res) => {
  let user = await models.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    if (req.accepts('html')) {
      await user.generateToTPSecret();
      req.session.email = user.email;
      res.redirect('/reset/confirmCode');
    } else {
      res.status(HttpStatus.OK).end();
    }
  } else {
    if (req.accepts('html')) {
      res.redirect('/reset?error=incorrectEmail');
    } else {
      res.status(HttpStatus.UNAUTHORIZED).end();
    }
  }
});

router.post('/confirm', async (req, res) => {
  let user = await models.User.findOne({
    where: {
      email: req.session.email,
    },
  });
  const verified = user.verifyTwoFactor(req);
  if (verified) {
    if (req.accepts('html')) {
      req.session.resetPassword = true;
      res.redirect('/reset/newPassword');
    } else {
      res.status(HttpStatus.OK).end();
    }
  } else {
    if (req.accepts('html')) {
      res.redirect('/reset/confirmCode?error=incorrectCode');
    } else {
      res.status(HttpStatus.UNAUTHORIZED).end();
    }
  }
});

router.post('/newPassword', async (req, res) => {
  const newPassword = req.body.password[0];
  const email = req.session.email;
  if (!req.session.resetPassword) {
    if (req.accepts('html')) {
      req.session.email = null;
      res.redirect('/?auth=unauthorized');
    } else {
      res.status(HttpStatus.UNAUTHORIZED).end();
    }
  } else {
    let user = await models.User.findOne({
      where: {
        email: email,
      },
    });
    try {
      await user.update({ password: newPassword });
      await user.save();
      res.redirect('/?reset=success');
      req.session.email = null;
      req.session.resetPassword = false;
    } catch (err) {
      res.redirect('/reset/newPassword?error=invalidPassword');
    }
  }
});

module.exports = router;
