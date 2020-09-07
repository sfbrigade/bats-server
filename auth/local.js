const bcrypt = require("bcrypt");
const models = require("../models");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(async function (username, password, done) {
  try {
    const user = await models.User.findOne({where: { email: username }, rejectOnEmpty: true});
    const result = await bcrypt.compare(password, user.hashedPassword);
    if (result) {
      return done(null, user);
    }
    return done(null, false, {
      message: "Invalid username or password.",
    });
  } catch (error) {
    done(error, null);
  }
});
