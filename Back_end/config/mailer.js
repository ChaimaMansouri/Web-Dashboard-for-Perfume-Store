const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = (options) => {
  transporter.sendMail(options, (error, info) => {
    if (error) console.error('Email Error:', error);
    else console.log('Email sent:', info.response);
  });
};

module.exports = sendMail;
