const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');

const models = require('../../models');
const rollbar = require('../../lib/rollbar');

const router = express.Router();

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user) => {
    if (err) {
      rollbar.error(err, req);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
    } else if (user) {
      req.login(user, async () => {
        const org = await user.getOrganization();
        if (org.isMfaEnabled) {
          await req.user.generateToTPSecret('twoFactor');
          res.status(HttpStatus.ACCEPTED).end();
        } else {
          req.session.twoFactor = true;
          user.Organization = org;
          res.json(await user.getLoginPayloadJSON());
        }
      });
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
    }
  })(req, res, next);
});

router.post('/twoFactor', async (req, res) => {
  if (req.user) {
    const verified = req.user.verifyTwoFactor(req.body.code);
    // If the code is verified, set the session to twoFactor
    if (verified) {
      req.session.twoFactor = true;
      res.json(await req.user.getLoginPayloadJSON());
    } else {
      res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
    }
  } else {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).end();
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

router.post('/forgot', async (req, res) => {
  let user = await models.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (user) {
    await user.generateToTPSecret('resetPassword');
    res.status(HttpStatus.OK).end();
  } else {
    res.status(HttpStatus.NOT_FOUND).end();
  }
});

router.post('/reset', async (req, res) => {
  const { email, code, password } = req.body;
  let user = await models.User.findOne({
    where: {
      email,
    },
  });
  if (user == null) {
    res.status(HttpStatus.FORBIDDEN).end();
  } else {
    const verified = user.verifyTwoFactor(code);
    if (verified) {
      try {
        await user.update({ password });
        await user.save();
        res.status(HttpStatus.OK).end();
      } catch (err) {
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).end();
      }
    } else {
      res.status(HttpStatus.FORBIDDEN).end();
    }
  }
});

module.exports = router;
