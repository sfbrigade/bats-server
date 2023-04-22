const nodemailer = require('nodemailer');

// create reusable transporter class using the default SMTP transport with functions
class EmailTransporter {
  constructor() {
    // set up transporter to send through Mailcatcher
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: 'user ',
        pass: 'pass',
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
