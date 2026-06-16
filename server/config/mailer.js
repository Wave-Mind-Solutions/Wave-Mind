/**
 * Nodemailer transporter configuration
 */
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,   // 5 seconds
  socketTimeout: 10000,    // 10 seconds
});

module.exports = transporter;
