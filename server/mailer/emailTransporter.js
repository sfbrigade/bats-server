const nodemailer = require('nodemailer');
const nodemailermock = require('nodemailer-mock');
const templateEmail = require('email-templates');

// create reusable transporter class using the default SMTP transport with functions
function createTransport() {
  // nodeMailer options
  const options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  };
  // mock Transporter in testing env
  const transporter = process.env.NODE_ENV === 'test' ? nodemailermock.createTransport(options) : nodemailer.createTransport(options);
  return transporter;
}

// Wrapper over transporter that allows for the use of templates
function templateTransporter() {
  const templateTransporter = new templateEmail({
    send: true,
    transport: createTransport(),
    views: {
      root: __dirname + '/templates',
      options: {
        extension: 'ejs', // <---- HERE
      },
    },
  });
  return templateTransporter;
}

// send mail with defined transport object
function sendMail(to, subject, template, variables) {
  const templateEmailer = templateTransporter();
  templateEmailer
    .send({
      template: template,
      message: {
        subject: subject,
        from: process.env.SMTP_REPLY_TO,
        to: to,
      },
      locals: variables,
    })
    .catch(console.error);
}

module.exports = { createTransport, sendMail };
