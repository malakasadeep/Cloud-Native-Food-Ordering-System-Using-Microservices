const mongoose = require("mongoose");
const config = require("./config.js");
require("dotenv").config();

const env = process.env.NODE_ENV;
const dbConfig = config[env];

const connectToDb = async () => {
  try {
    await mongoose.connect(dbConfig.mongoDbUrl);
    console.log(
      "\x1b[33m%s\x1b[0m",
      "Server Sucesfully Connected to Mongo DB Database"
    );
  } catch (error) {
    console.error("\x1b[31m%s\x1b[0m", "Error connecting to MongoDB:", error);
  }
};

module.exports = connectToDb;
