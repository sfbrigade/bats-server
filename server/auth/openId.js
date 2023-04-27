var OpenIDConnectStrategy = require('passport-openidconnect');

const { AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_SECRET } = process.env;

module.exports = new OpenIDConnectStrategy(
  {
    issuer: `https://${AUTH0_ISSUER_BASE_URL}`,
    authorizationURL: `https://${AUTH0_ISSUER_BASE_URL}/authorize`,
    tokenURL: `https://${AUTH0_ISSUER_BASE_URL}/oauth/token`,
    userInfoURL: `https://${AUTH0_ISSUER_BASE_URL}/userinfo`,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_SECRET,
    callbackURL: 'http://localhost:3000/auth/oauth2/redirect',
    scope: ['openid profile'],
    passReqToCallback: true,
  },
  function verify(issuer, profile, context, idToken, cb) {
    console.log('verifying');
    const info = {
      issuer,
      profile,
      context,
      idToken,
    };
    return cb(null, profile, info);
   
  }
);
