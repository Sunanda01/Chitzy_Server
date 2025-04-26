const jwt = require("jsonwebtoken");
const JWT_Secret = require("../config/config").JWT_Secret;
const customErrorHandler = require("../services/customErrorHandler");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return next(customErrorHandler.tokenError("Token Not Available"));
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return next(customErrorHandler.tokenError("Token Not Found"));
  try {
    jwt.verify(token, JWT_Secret, (err, user) => {
      if (err) return next(customErrorHandler.tokenError("Invalid Token"));
      req.user = user;
      next();
    });
  } catch (err) {
    return next(customErrorHandler.tokenError("Internal Server error"));
  }
};
module.exports = verifyToken;
