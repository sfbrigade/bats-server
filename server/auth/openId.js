var OpenIDConnectStrategy = require('passport-openidconnect');

const { AUTH0_ISSUER_BASE_URL, AUTH0_CLIENT_ID, AUTH0_SECRET } = process.env;
const models = require('../models');

module.exports = new OpenIDConnectStrategy(
  {
    issuer: `https://${AUTH0_ISSUER_BASE_URL}/`,
    authorizationURL: `https://${AUTH0_ISSUER_BASE_URL}/authorize`,
    tokenURL: `https://${AUTH0_ISSUER_BASE_URL}/oauth/token`,
    userInfoURL: `https://${AUTH0_ISSUER_BASE_URL}/userinfo`,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_SECRET,
    callbackURL: 'http://localhost:3000/auth/oauth2/redirect',
  },
  async function verify(issuer, profile, context, idToken, accessToken, refreshToken, cb) {
   
    // find user by federated credentials and join user
    

   const federatedUser = await models.FederatedUser.findOne({
      where: {provider: issuer, subject: profile.id},
      include: [models.User]
    })

    // if found, add to callback
    if(federatedUser) {
      return cb(null, federatedUser);
    } else {

     const user = await models.User.findOne({
        where: { email: profile.emails[0].value },
      });
    
      if(user) {
        const addedFederatedUser = await models.FederatedUser.create({
          provider: issuer, 
          subject: profile.id,
          userId: user.id
        })
      }
      
      return cb(null, user);
    }
    

    // if not found, find user by email

    // if found by email but no federated credentials, add federated credentials then return in callback

    // if not found by either method, throw an unauthorized error

  }
);
