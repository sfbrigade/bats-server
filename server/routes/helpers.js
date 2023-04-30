const HttpStatus = require('http-status-codes');
const _ = require('lodash');
const { sendMail } = require('../auth/emailTransporter');
const OTPAuth = require('otpauth');
const models = require('../models');

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

async function generateToTPSecret(email, transporter) {
  const secret = new OTPAuth.Secret();
  // new TOTP object using the secret key
  const totp = new OTPAuth.TOTP({
    secret: secret.base32,
    issuer: 'Routed',
    period: -1,
    digits: 6,
  });
  // save the secret key to the session
  // generate secret token
  const token = totp.generate();
  // Save token and expiration timestamp in DB (Expires in 15 minutes from inital Log In)
  const user = await models.User.findOne({
    where: { email: email },
  });
  // save totp secret and expiration timestamp in DB
  await user.update({ twoFactorData: { totptimestamp: Date.now() + 900000, totptoken: token } });
  await user.save();
  // send email with token
  sendMail(
    transporter,
    email,
    'Your Authentication Code from Routed',
    `This is your Authentication Code: ${token} . It will expire in 15 minutes.`
  );
}
async function verifyTwoFactor(req) {
  const token = req.body.code;
  const email = req.user.dataValues.email;
  const user = await models.User.findOne({
    where: { email: email },
  });

  const totptoken = user.dataValues.twoFactorData.totptoken;
  const totptimestamp = user.dataValues.twoFactorData.totptimestamp;
  const verified = token === totptoken && Date.now() < totptimestamp;

  return verified;
}
module.exports = {
  wrapper,
  setPaginationHeaders,
  generateToTPSecret,
  verifyTwoFactor,
};
