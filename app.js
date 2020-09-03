const express = require("express");
const expressSession = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
const localStrategy = require("./auth/local/local.js");
const samlStrategy = require("./auth/saml/saml.js");
const indexRouter = require("./routes/index");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET,
  })
);

require("./auth");
passport.use(localStrategy);
passport.use("saml", samlStrategy);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, "build")));
app.use(express.static(path.join(__dirname, "public")));

app.get("/login/saml", passport.authenticate("saml"));
app.post("/login/saml/callback", passport.authenticate("saml"), function (
  req,
  res,
  next
) {
  res.sendStatus(200);
});
app.get("/metadata", function (req, res) {
  res.type("application/xml");
  res
    .status(200)
    .send(
      samlStrategy.generateServiceProviderMetadata(
        process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, "\n"),
        process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, "\n")
      )
    );
});

app.use("/", indexRouter);

module.exports = app;
