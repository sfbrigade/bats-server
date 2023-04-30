const nodemailer = require('nodemailer');
const nodemailermock = require('nodemailer-mock');

// create reusable transporter class using the default SMTP transport with functions
function createTransport() {
  // nodeMailer options
  const options = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: 'user ',
      pass: 'pass',
    },
  };
  // mock Transporter in testing env
  const transporter = process.env.NODE_ENV === 'test' ? nodemailermock.createTransport(options) : nodemailer.createTransport(options);
  return transporter;
}
// send mail with defined transport object
function sendMail(transporter, recipient, subject, content) {
  const mailOptions = {
    from: process.env.NODEMAIL_EMAIL,
    to: recipient,
    subject: subject,
    text: content,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

module.exports = { createTransport, sendMail };
