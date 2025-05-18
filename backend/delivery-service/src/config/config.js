require("dotenv").config();

module.exports = {
  development: {
    //configurations for development environment
    mongoDbUrl: process.env.MONGODB_URI,
    logging: false,
  },
  test: {
    //configurations for test environment
  },
  production: {
    //configurations for production environment
  },
};
