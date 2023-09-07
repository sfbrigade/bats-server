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
    await req.user.generateToTPSecret('twoFactor');
    res.render('auth/local/twoFactor');
  } else {
    // currently does not exist becuase moved to the front end
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
      req.login(user, async () => {
        const org = await user.getOrganization();
        if (!org.isMfaEnabled) {
          req.session.twoFactor = true;
        }
        if (req.accepts('html')) {
          if (org.isMfaEnabled) {
            res.redirect('/auth/local/twoFactor');
          } else {
            res.redirect('/');
          }
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
      await user.generateToTPSecret('resetPassword');
      res.redirect('/reset/emailSent');
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

router.post('/newPassword', async (req, res) => {
  const newPassword = req.body.password[0];
  const email = req.body.email;
  const code = req.body.code;
  let user = await models.User.findOne({
    where: {
      email: email,
    },
  });
  if (user == null) {
    if (req.accepts('html')) {
      res.redirect(`/reset/newPassword?error=invalidEmail&email=${email}&code=${code}`);
    } else {
      res.status(HttpStatus.UNAUTHORIZED).end();
    }
  } else {
    const verified = user.verifyTwoFactor(req);
    if (verified) {
      try {
        await user.update({ password: newPassword });
        await user.save();
        res.redirect('/?reset=success');
      } catch (err) {
        res.redirect(`/reset/newPassword?error=invalidPassword&email=${email}&code=${code}`);
      }
    } else {
      if (req.accepts('html')) {
        res.redirect(`/reset/newPassword?error=incorrectCode&email=${email}&code=${code}`);
      } else {
        res.status(HttpStatus.UNAUTHORIZED).end();
      }
    }
  }
});

module.exports = router;
