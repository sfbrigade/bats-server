const passportSaml = require('passport-saml');
const models = require('../models');

module.exports = new passportSaml.Strategy(
  {
    callbackUrl: 'http://localhost:3000/auth/saml/callback',
    entryPoint: 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
    issuer: 'bats-server',
    identifierFormat: null,
    cert: process.env.SAML_IDP_PUBLIC_KEY,
    decryptionPvk: process.env.SAML_SP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    privateCert: process.env.SAML_SP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    validateInResponseTo: true,
    disableRequestedAuthnContext: true,
  },
  async (profile, done) => {
    try {
      const [user] = await models.User.findOrCreate({
        where: { email: profile.email },
        defaults: {
          firstName: 'SAML',
          lastName: 'User',
          isSuperUser: false,
        },
      });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  }
);
