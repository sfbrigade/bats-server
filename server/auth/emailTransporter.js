const nodemailer = require('nodemailer');

// create reusable transporter class using the default SMTP transport with functions
class EmailTransporter {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.NODEMAIL_EMAIL,
        pass: process.env.NODEMAIL_APP_PASSWORD,
      },
    });
  }

  // send mail with defined transport object
  sendMail(recipient, subject, content) {
    const mailOptions = {
      from: process.env.NODEMAIL_EMAIL,
      to: recipient,
      subject: subject,
      text: content,
    };
    this.transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }
}

module.exports = EmailTransporter;
