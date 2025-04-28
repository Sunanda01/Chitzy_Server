const customErrorHandler = require("../services/customErrorHandler");
function errorHandler(err, req, res, next) {
  let errorStatus = err.status || 500;
  let errorMessage = err.message || "Internal Sever Error";
  if (err instanceof customErrorHandler) {
    errorStatus = err.status;
    errorMessage = err.message;
  }
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    msg: errorMessage,
    stack: err.stack,
  });
}
module.exports = errorHandler;
