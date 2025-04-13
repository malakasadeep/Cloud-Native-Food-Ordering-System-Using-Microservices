import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter;

try {
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE, 
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} catch (error) {
  console.error('Error creating email transporter:', error);
}


export const sendEmail = async (to, subject, message) => {
  if (!transporter) {
    const error = new Error('Email service is not configured properly');
    error.statusCode = 503;
    throw error;
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    const customError = new Error(error.message || 'Failed to send email');
    customError.statusCode = 500;
    customError.originalError = error;
    throw customError;
  }
};