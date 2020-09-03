const passport = require("passport");
const db = require("../models");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  db.User.findByPk(id)
    .catch((error) => done(error, null))
    .then((user) => done(null, user.id));
});

exports.isAuthenticated = function (req, res, next) {
  if (!req.user) {
    res.redirect("/login");
  } else {
    next();
  }
};
