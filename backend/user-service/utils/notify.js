import axios from 'axios';
import config from '../config/index.js';
import logger from './logger.js';


const notificationClient = axios.create({
  baseURL: config.services.notification.baseUrl,
  timeout: 5000, 
  headers: {
    'Content-Type': 'application/json',
  }
});


async function notifyEmail(to, subject, message) {
  try {
    const response = await notificationClient.post('api/v1/notification/send-email', {
      to,
      subject,
      message
    });
    logger.info(`Email notification sent to ${to}`, { subject });
    return response.data;
  } catch (error) {
    logger.error(`Failed to send email notification to ${to}`, { 
      subject, 
      error: error.message 
    });
    throw new Error(`Email notification failed: ${error.message}`);
  }
}


async function notifySMS(mobile, message) {
  try {
    const response = await notificationClient.post('api/v1/notification/send-sms', {
      mobile,
      message
    });
    logger.info(`SMS notification sent to ${mobile}`);
    return response.data;
  } catch (error) {
    logger.error(`Failed to send SMS notification to ${mobile}`, { 
      error: error.message 
    });
    throw new Error(`SMS notification failed: ${error.message}`);
  }
}

export { notifyEmail, notifySMS };
