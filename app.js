const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const expressSession = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('./auth/passport');
const { isAuthenticated } = require('./auth/middleware');

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);

if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev'));
}
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

app.use(passport.initialize());
app.use(passport.session());

app.use('/libraries/uswds', express.static(path.join(__dirname, 'node_modules/uswds/dist')));
app.use(express.static(path.join(__dirname, 'build'), { index: false }));
app.use(express.static(path.join(__dirname, 'public'), { index: false }));
app.use('/', require('./routes'));

app.get('/*', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;
