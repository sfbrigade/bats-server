exports.loginGet = function (req, res, next) {
  // todo?
};

exports.loginPost = function (req, res, next) {
  res.redirect("/");
};

exports.logout = function (req, res, next) {
  req.logout();
  res.redirect("/login");
};
