// middleware/errorMiddleware.js

// error handler function to create error object
const errorHandler = (status, message) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

// global error handling middleware
const handleError = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something Went Wrong!";

  //log error details
  console.error(`Error Status: ${status}, Message: ${message}`);
  console.error(err.stack);

  //send error details with response
  res.status(status).json({
    sucess: false,
    message: message || "Internal server error",
    timestamp: new Date().toISOString(),
  });
};

module.exports = { handleError, errorHandler };
