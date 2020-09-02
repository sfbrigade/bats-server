const bcrypt = require("bcrypt");
const db = require("../models");

const saltRounds = 10;

exports.loginGet = function (req, res, next) {
  // TODO or serve statically?
};

exports.loginPost = function (req, res, next) {
  res.redirect("/");
};

exports.logoutPost = function (req, res, next) {
  req.logout();
  res.redirect("/login");
};

// TODO - move somewhere else
exports.createUser = function (req, res, next) {
  const { password } = req.body;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      // TODO - handle error
      console.log(err);
      res.status(500);
      res.send({ msg: "An error occurred" });
    }
    const userData = {
      email: req.body.email,
      hashedPassword: hash,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      subjectId: req.body.subjectId,
      ssoData: req.body.ssoData,
      roleName: req.body.roleName,
      isSuperUser: req.body.isSuperUser,
    };
    db.User.create(userData)
      .then((user) => res.send({ msg: "success" }))
      .catch((err) => {
        // TODO - handle error
        console.log(err);
        res.status(500);
        res.send({ msg: "An error occurred" });
      });
  });
};
