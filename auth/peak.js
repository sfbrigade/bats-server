const axios = require('axios');
const crypto = require('crypto');
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
  async function verify(accessToken, refreshToken, profile, done) {
    let user = null;
    try {
      if (profile?.user?.email) {
        user = await models.User.findOne({
          where: {
            email: profile.user.email,
          },
        });
        if (!user && profile?.user?.currentAssignment?.vehicle?.createdByAgency) {
          // look up corresponding org from agency data
          const { stateId: state, stateUniqueId } = profile.user.currentAssignment.vehicle.createdByAgency;
          const organization = await models.Organization.findOne({
            where: {
              type: 'EMS',
              state,
              stateUniqueId,
            },
          });
          // create new user
          if (organization) {
            await models.sequelize.transaction(async (transaction) => {
              const { firstName, lastName, email } = profile.user;
              user = await models.User.create(
                {
                  OrganizationId: organization.id,
                  firstName,
                  lastName,
                  email,
                  isOperationalUser: true,
                  password: crypto.randomBytes(8).toString('hex') + 'Aa!',
                  CreatedById: '00000000-0000-0000-0000-000000000000',
                  UpdatedById: '00000000-0000-0000-0000-000000000000',
                },
                { transaction }
              );
              await user.update(
                {
                  CreatedById: user.id,
                  UpdatedById: user.id,
                },
                { transaction }
              );
            });
          }
        }
      }
      done(null, user);
    } catch (err) {
      done(err, false);
    }
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
