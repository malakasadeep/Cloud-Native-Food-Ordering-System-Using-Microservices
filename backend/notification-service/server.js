import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
app.use(express.json());

import { sendEmail } from './services/emailService.js';
import { sendSMS } from './services/smsService.js';


const validateEmailRequest = (req, res, next) => {
  const { to, subject, message } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ error: 'Missing required fields: to, subject, and message are required' });
  }
  next();
};

const validateSmsRequest = (req, res, next) => {
  const { mobile, message } = req.body;
  if (!mobile || !message) {
    return res.status(400).json({ error: 'Missing required fields: mobile and message are required' });
  }
  next();
};

app.post('/api/v1/notification/send-email', validateEmailRequest, async (req, res, next) => {
  const { to, subject, message } = req.body;
  try {
    await sendEmail(to, subject, message);
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (err) {
    next(err); 
  }
});

app.post('/api/v1/notification/send-sms', validateSmsRequest, async (req, res, next) => {
  const { mobile, message } = req.body;
  try {
    await sendSMS(mobile, message);
    res.json({ success: true, message: 'SMS sent successfully' });
  } catch (err) {
    next(err); 
  }
});


app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});


app.use((err, req, res, next) => {
  console.error('Error:', err);
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal server error';
  
  res.status(statusCode).json({
    success: false,
    error: errorMessage,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  // Log error and gracefully shut down if needed
  // process.exit(1); // Uncomment for production
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
  
});

app.listen(5005, () => console.log('Notification service running on port 5005'));
