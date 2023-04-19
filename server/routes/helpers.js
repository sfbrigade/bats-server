const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const EmailTransporter = require('../auth/emailTransporter');
const OTPAuth = require('otpauth');

function setPaginationHeaders(req, res, page, pages, total) {
  const baseURL = `${process.env.BASE_URL}${req.baseUrl}${req.path}?`;
  const query = _.clone(req.query);
  let link = '';
  const pageNum = parseInt(page, 10);
  if (pageNum < pages) {
    query.page = pageNum + 1;
    link += `<${baseURL}${new URLSearchParams(query).toString()}>; rel="next"`;
  }
  if (pageNum < pages - 1) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = pages;
    link += `<${baseURL}${new URLSearchParams(query).toString()}>; rel="last"`;
  }
  if (pageNum > 2) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = 1;
    link += `<${baseURL}${new URLSearchParams(query).toString()}>; rel="first"`;
  }
  if (pageNum > 1) {
    if (link.length > 0) {
      link += ',';
    }
    query.page = pageNum - 1;
    link += `<${baseURL}${new URLSearchParams(query).toString()}>; rel="prev"`;
  }
  const headers = {
    'X-Total-Count': total,
    Link: link,
  };
  res.set(headers);
}

function wrapper(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((error) => {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        /// if we've got a schema validation error, extract the individual errors
        let originalError = error;
        if (error.errors.length === 1 && error.errors[0].path === 'schema') {
          originalError = error.errors[0].original;
        }
        res.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          messages: originalError.errors.map((e) => _.pick(e, ['path', 'message', 'value'])),
        });
      } else {
        // console.log(error);
        next(error);
      }
    });
  };
}

function generateToTPSecret(req, email) {
  const secret = new OTPAuth.Secret();
  // new TOTP object using the secret key
  const totp = new OTPAuth.TOTP({
    secret: secret.base32,
    issuer: 'Routed',
    period: -1,
    digits: 6,
  });
  // save the secret key to the session
  req.session.totpTimeStamp = Date.now();
  req.session.totpKey = secret.base32;
  // generate secret token
  const token = totp.generate();
  console.log(token);
  const emailTransporter = new EmailTransporter();
  emailTransporter.sendMail(
    email,
    'Your Authentication Code from Routed',
    `This is your Authentication Code: ${token} . It will expire in 15 minutes.`
  );
}
module.exports = {
  wrapper,
  setPaginationHeaders,
  generateToTPSecret,
};
