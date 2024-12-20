const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

const createEmail = (receiver, subject, text) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: receiver,
    subject: subject,
    text: text
  };
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return error;
    }
      return `Email sent: ${info.response}`;
    });
  };

  module.exports = {
    createEmail
  };