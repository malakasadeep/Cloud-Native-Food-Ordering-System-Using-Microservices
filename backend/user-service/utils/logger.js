import config from '../config/index.js';

const logger = {
  info: (message, meta = {}) => {
    if (['development', 'staging', 'production'].includes(config.env)) {
      console.log(`[INFO] ${message}`, meta);
    }
  },
  
  error: (message, meta = {}) => {
    console.error(`[ERROR] ${message}`, meta);
  },
  
  warn: (message, meta = {}) => {
    console.warn(`[WARN] ${message}`, meta);
  },
  
  debug: (message, meta = {}) => {
    if (config.logging.level === 'debug') {
      console.debug(`[DEBUG] ${message}`, meta);
    }
  }
};

export default logger;
