const passport = require('passport');
const models = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use('local', require('./local'));
passport.use('peak', require('./peak'));
passport.use('openidconnect', require('./openId'));

module.exports = passport;
