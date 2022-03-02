const axios = require('axios');
const OAuth2Strategy = require('passport-oauth2');

const models = require('../models');

const { BASE_URL, PR_BASE_URL, PR_CLIENT_ID, PR_CLIENT_SECRET } = process.env;

const instance = axios.create({
  baseURL: PR_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

const strategy = new OAuth2Strategy(
  {
    authorizationURL: `${PR_BASE_URL}/oauth/authorize`,
    tokenURL: `${PR_BASE_URL}/oauth/token`,
    clientID: PR_CLIENT_ID,
    clientSecret: PR_CLIENT_SECRET,
    callbackURL: `${BASE_URL}/auth/peak/callback`,
  },
  async function verify(accessToken, refreshToken, profile, cb) {
    console.log(accessToken, refreshToken, profile);
    let user = null;
    if (profile?.user?.email) {
      user = await models.User.findOne({
        where: {
          email: profile.user.email,
        },
      });
      if (!user && profile?.user?.currentAssignment?.vehicle?.createdByAgency) {
        // look up corresponding org from agency data
        // create new user
      }
    }
    cb(user);
  }
);

strategy.userProfile = function userProfile(accessToken, done) {
  instance
    .get('/api/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      return done(null, response.data);
    });
};

module.exports = strategy;
