import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendEmail = (to, subject, text) => {
  return transporter.sendMail({ from: process.env.MAIL_USER, to, subject, text });
};

export default { sendEmail };