const passportSaml = require("passport-saml");
const models = require("../models");

module.exports = new passportSaml.Strategy(
  {
    callbackUrl: "http://localhost:3000/login/saml/callback",
    entryPoint: "http://localhost:8080/simplesaml/saml2/idp/SSOService.php",
    issuer: "bats-server",
    identifierFormat: null,
    cert: process.env.SAML_IDP_PUBLIC_KEY,
    decryptionPvk: process.env.SAML_SP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    privateCert: process.env.SAML_SP_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    validateInResponseTo: true,
    disableRequestedAuthnContext: true,
  },
  function (profile, done) {
    models.User.findOrCreate({
      where: { email: profile.email },
      defaults: {
        firstName: "SAML",
        lastName: "User",
        roleName: "test",
        isSuperUser: false,
      },
    }).then(([user, created]) => done(null, user));
  }
);
