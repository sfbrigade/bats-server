const passport = require("passport");
const models = require("../../models");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(function (username, password, done) {
    console.log("verifyFunction"); //TODO - remove log statement
    models.User.findOne({ where: { email: username } })
      .catch((error) => {
        // TODO - display a message to user, an error occurred while fetching user
        done(error, null);
      })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "Invalid username or password.",
          });
          // TODO - verify that password provided equals password in the DB
        }
        done(null, user);
      });
  })
);

passport.serializeUser(function (user, done) {
  console.log("serialize"); // TODO - remove log statement
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("deserializeUser", id); // TODO - remove log statement
  models.User.findByPk(id)
    .catch((error) => done(error, null))
    .then((user) => done(null, user));
  done(null, id);
});
