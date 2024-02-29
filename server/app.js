const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
const path = require('path');
const cookieSession = require('cookie-session');
const logger = require('morgan');

const passport = require('./auth/passport');
const rollbar = require('./lib/rollbar');

const app = express();
const client = (...args) => path.join(__dirname, '../client', ...args);

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(expressLayouts);

// redirect all requests to https in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.secure || req.path?.startsWith('/webhooks')) {
      next();
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
}

// set up the static routes before the logger to reduce console noise
app.use(express.static(client('build'), { index: false }));
app.use(express.static(client('public'), { index: false }));
app.use('/libraries/fontawesome-free', express.static('../node_modules/@fortawesome/fontawesome-free'));
app.use('/libraries/uswds/theme', express.static('../node_modules/uswds/dist'));

if (process.env.NODE_ENV !== 'production') {
  // for theme css sourcemap debugging only
  app.use('/theme', express.static(client('src/theme')));
  app.use('/node_modules/uswds/dist', express.static('../node_modules/uswds/dist'));
}

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.sessionParser = cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  secret: process.env.SESSION_SECRET,
  secure: process.env.NODE_ENV === 'production',
});
app.use(app.sessionParser);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes'));

app.get('/*', (req, res) => {
  let data = fs.readFileSync(client('build', 'index.html')).toString('utf8');
  data = data.replace(/window\.env\.([^ =]+)[^,;<]+/g, (match, p1) => `window.env.${p1} = '${process.env[p1] ?? ''}'`);
  res.send(data);
});

// log unhandled errors with Rollbar
app.use(rollbar.errorHandler());

module.exports = app;
