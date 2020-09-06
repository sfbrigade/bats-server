const express = require("express");
const HttpStatus = require("http-status-codes");
const passport = require("passport");
const router = express.Router();

router.get("/login", passport.authenticate("saml"));

router.post("/login/callback", passport.authenticate("saml"), function (req, res, next) {
  res.sendStatus(HttpStatus.OK);
});

router.get("/metadata", function (req, res) {
  res.type("application/xml");
  res.status(200)
    .send(
      samlStrategy.generateServiceProviderMetadata(
        process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, "\n"),
        process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, "\n")
      )
    );
});

module.exports = router;
