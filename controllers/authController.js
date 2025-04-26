const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const customErrorHandler = require("../services/customErrorHandler");
const JWT_Secret = require("../config/config").JWT_Secret;
const JWT_Expiry = require("../config/config").JWT_Expiry;

const authController = {
  async signup(req, res, next) {
    const { email, fullName, password } = req.body;
    try {
      if (!email || !fullName || !password)
        return next(customErrorHandler.missingField("All fields are required"));
      const existUser = await User.findOne({ email });
      if (existUser)
        return next(
          customErrorHandler.alreadyExist("Email already Registered")
        );
      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const newUser = new User({
        email,
        fullName,
        password: hashPassword,
      });
      const generateToken = jwt.sign(
        {
          id: newUser._id,
          email,
        },
        JWT_Secret,
        { expiresIn: JWT_Expiry }
      );
      await newUser.save();
      return res.status(200).json({
        success: true,
        msg: "User created Successfully",
        user: { id: newUser._id, email, fullName, accessToken: generateToken },
      });
    } catch (err) {
      return next(customErrorHandler.serverError("Internal Server error"));
    }
  },

  async login(req, res, next) {
    const { email, password } = req.body;
    try {
      if (!email || !password)
        return next(customErrorHandler.missingField("All fields are required"));
      const existUser = await User.findOne({ email });
      if (!existUser)
        return next(customErrorHandler.notFound("User Not Found"));
      const checkPasswordMatch = bcrypt.compare(password, existUser.password);
      if (!checkPasswordMatch)
        return next(customErrorHandler.wrongCredentials("Incorrect Password"));
      const generateToken = jwt.sign(
        {
          id: existUser._id,
          email: existUser.email,
        },
        JWT_Secret,
        { expiresIn: JWT_Expiry }
      );
      return res.status(200).json({
        success: true,
        msg: "Login In Successfully",
        user: {
          id: existUser._id,
          name: existUser.name,
          email: existUser.email,
          accessToken: generateToken,
        },
      });
    } catch (err) {
      return next(customErrorHandler.serverError("Internal Server Error"));
    }
  },

  async logout(req, res, next) {
    try {
      return res
        .status(200)
        .json({ success: true, msg: "Logged out Successfully" });
    } catch (err) {
      return next(customErrorHandler.serverError("Something Went Wrong"));
    }
  },
};
module.exports = authController;
