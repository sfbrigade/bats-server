const bcrypt = require("bcrypt");
const passport = require("passport");
const db = require("../../models");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
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
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.User.findByPk(id)
    .catch((error) => done(error, null))
    .then((user) => done(null, user.id));
});
