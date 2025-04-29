
const config = {
  env: process.env.NODE_ENV || 'development',
  services: {
    notification: {
      baseUrl: process.env.NOTIFICATION_SERVICE_URL 
      //|| 'http://localhost:5005'
    }
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info'
  }
};

export default config;
