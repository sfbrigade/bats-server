const express = require('express');
const HttpStatus = require('http-status-codes');
const passport = require('passport');
const samlStrategy = require('../../auth/saml.js');

const router = express.Router();

router.get('/login', passport.authenticate('saml'));

router.post('/callback', passport.authenticate('saml'), (req, res) => {
  if (req.accepts('html')) {
    res.redirect('/');
  } else {
    res.status(HttpStatus.OK).end();
  }
});

router.get('/metadata', (req, res) => {
  res.type('application/xml');
  res
    .status(200)
    .send(
      samlStrategy.generateServiceProviderMetadata(
        process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, '\n'),
        process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, '\n')
      )
    );
});

module.exports = router;
