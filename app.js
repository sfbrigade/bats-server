const express = require('express');
const expressSession = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const passportSaml = require('passport-saml');

const indexRouter = require('./routes/index');
const models = require('./models');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressSession({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  console.log('deserializeUser', id);
  models.User.findByPk(id)
    .catch(error => done(error, null))
    .then(user => done(null, user));
});

const samlStrategy = new passportSaml.Strategy({
  callbackUrl: 'http://localhost:3000/login/saml/callback',
  entryPoint: 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
  issuer: 'bats-server',
  identifierFormat: null,
  cert: process.env.SAML_IDP_PUBLIC_KEY,
  decryptionPvk: process.env.SAML_SP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  privateCert: process.env.SAML_SP_PRIVATE_KEY.replace(/\\n/g, '\n'),
  validateInResponseTo: true,
  disableRequestedAuthnContext: true
}, function(profile, done) {
  models.User.findOrCreate({where: {email: profile.email}, defaults: {firstName: 'SAML', lastName: 'User', roleName: 'test', isSuperUser: false}})
    .then(([user, created]) => done(null, user));
});
passport.use('saml', samlStrategy);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/login/saml', passport.authenticate('saml'));
app.post('/login/saml/callback', passport.authenticate('saml'), function(req, res, next) {
  res.sendStatus(200);
});
app.get('/metadata', function(req, res) {
  res.type('application/xml');
  res.status(200).send(samlStrategy.generateServiceProviderMetadata(
    process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, '\n'), 
    process.env.SAML_SP_PUBLIC_KEY.replace(/\\n/g, '\n')
  ));
});

app.use('/', indexRouter);

module.exports = app;
