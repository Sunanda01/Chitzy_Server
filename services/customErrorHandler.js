class customErrorHandler extends Error {
  constructor(status, msg) {
    super();
    this.status = status;
    this.message = msg;
    this.success = false;
  }
  static alreadyExist(message) {
    return new customErrorHandler(409, message);
  }

  static wrongCredentials(message = "Your email & password is wrong") {
    return new customErrorHandler(402, message);
  }

  static missingField(message = "All fields are rquired") {
    return new customErrorHandler(400, message);
  }
  static tokenError(message = "Token Error") {
    return new customErrorHandler(401, message);
  }

  static unAuthorized(message = "Unauthorised User") {
    return new customErrorHandler(403, message);
  }

  static notFound(message = "404 Not Found") {
    return new customErrorHandler(404, message);
  }

  static serverError(message = "Internal Server Error") {
    return new customErrorHandler(500, message);
  }
}
module.exports = customErrorHandler;
