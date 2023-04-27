const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res, next) =>
  passport.authenticate('openidconnect', { scope: 'openid profile' }, (err, profile) => {
    console.log('err', err);
    console.log('profile', profile);
  })(req, res, next)
);

router.get('/redirect', (req, res, next) => {
  console.log('req.query', req.query);
  var reqParams = req.query;
  if (reqParams.error) {
    var err = new Error(reqParams.error);
    err.status = reqParams.error === 'access_denied' ? 403 : 400;
    err.message = reqParams.error_description;
    next(err);
  } else {
    passport.authenticate(
      'openidconnect',
      {
        callback: true,
        successReturnToOrRedirect: '/',
        // failureRedirect: '/',
        failureFlash: true,
      },
      (err, profile, info) => {
        console.log('err', err);
        console.log('profile', profile);
        console.log('info', info);
      }
    )(req, res, next);
  }
});

module.exports = router;
