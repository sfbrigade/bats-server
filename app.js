const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fs = require('fs');
const path = require('path');
const cookieSession = require('cookie-session');
const logger = require('morgan');
const passport = require('./auth/passport');
const { isAuthenticated } = require('./auth/middleware');

const app = express();

app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(expressLayouts);

if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.secure) {
      next();
    } else {
      res.redirect(`https://${req.headers.host}${req.url}`);
    }
  });
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

app.use(express.static(path.join(__dirname, 'build'), { index: false }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

app.use('/libraries/fontawesome-free', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free')));
app.use('/libraries/uswds/theme', express.static(path.join(__dirname, 'node_modules/uswds/dist')));
if (process.env.NODE_ENV !== 'production') {
  // for theme css sourcemap debugging only
  app.use('/theme', express.static(path.join(__dirname, 'theme')));
  app.use('/node_modules/uswds/dist', express.static(path.join(__dirname, 'node_modules/uswds/dist')));
}
app.use('/', require('./routes'));

app.get('/*', isAuthenticated, (req, res) => {
  let data = fs.readFileSync(path.join(__dirname, 'build', 'index.html')).toString('utf8');
  data = data.replace(/window\.env\.([^ =]+)[^;]+/g, (match, p1) => `window.env.${p1} = '${process.env[p1] ?? ''}'`);
  res.send(data);
});

module.exports = app;
