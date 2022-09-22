const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

const models = require('../models');

module.exports = new LocalStrategy(async (username, password, done) => {
  try {
    const user = await models.User.findOne({
      where: { email: username },
    });
    if (!user) {
      done(null, user);
      return;
    }
    const result = await bcrypt.compare(password, user.hashedPassword);
    if (result) {
      done(null, user);
      return;
    }
    done(null, false, {
      message: 'Invalid username or password.',
    });
  } catch (error) {
    done(error, null);
  }
});
