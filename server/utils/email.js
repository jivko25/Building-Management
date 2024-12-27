const nodemailer = require("nodemailer");

// Тест на SMTP връзката
const testConnection = async () => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    await transporter.verify();
    console.log("SMTP connection successful!");
  } catch (error) {
    console.error("SMTP connection failed:", error);
  }
};

testConnection();

const createEmail = async (to, subject, text, attachments) => {
  console.log("Creating email with attachments:", attachments);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to,
    subject,
    text,
    attachments
  };

  console.log("Sending email with options:", {
    to,
    subject,
    hasAttachments: !!attachments
  });

  try {
    console.log("Attempting to send email...");
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error in createEmail:", error);
    throw error;
  }
};

module.exports = {
  createEmail
};
