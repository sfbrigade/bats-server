const passport = require('passport');
const models = require('../models');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.User.findByPk(id, { rejectOnEmpty: true });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(require('./local'));
passport.use('saml', require('./saml'));

module.exports = passport;
