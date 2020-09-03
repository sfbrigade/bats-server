const bcrypt = require("bcrypt");
const db = require("../../models");
const LocalStrategy = require("passport-local").Strategy;

module.exports = new LocalStrategy(function (username, password, done) {
  console.log("verifyFunction"); //TODO - remove log statement
  db.User.findOne({ where: { email: username } })
    .catch((error) => {
      // TODO - display a message to user, an error occurred
      done(error, null);
    })
    .then((user) => {
      if (!user) {
        return done(null, false, {
          message: "Invalid username or password.",
        });
      }
      bcrypt.compare(password, user.hashedPassword).then((result) => {
        if (result) {
          return done(null, user);
        }
        return done(null, false, {
          message: "Invalid username or password.",
        });
      });
    });
});
