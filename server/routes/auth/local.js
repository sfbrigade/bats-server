const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
const { generateToTPSecret } = require('../helpers');
const models = require('../../models');
const notp = require('notp');

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

router.post('/reset', async (req, res) => {
  let user = await models.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    if (req.accepts('html')) {
      req.session.email = req.body.email;
      generateToTPSecret(req, user.dataValues.email);
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

router.post('/confirm', (req, res) => {
  const key = req.session.totpKey;
  const token = req.body.code;
  const verified = notp.totp.verify(token, key, { window: 30 });
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
      res.redirect('/?reset=success')
      req.session.email = null;
      req.session.resetPassword = false;
    } catch (err) {
      res.redirect('/reset/newPassword?error=invalidPassword');
    }
  }
});
module.exports = router;
