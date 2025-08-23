//Error creation, error body(class)
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'; //${} converts to string
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor); // To avoid polluting the stacktrace, which tells where the err is coming from
  }
}
module.exports = AppError;
