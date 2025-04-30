const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const customErrorHandler = require("../services/customErrorHandler");
const JWT_Secret = require("../config/config").JWT_Secret;
const JWT_Expiry = require("../config/config").JWT_Expiry;

const authController = {
  async signup(req, res, next) {
    const { email, fullName, password, profilePic } = req.body;
    try {
      if (!email || !fullName || !password || !profilePic)
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
        profilePic,
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
        msg: "User Created Successfully",
        user: {
          id: newUser._id,
          email,
          fullName,
          accessToken: generateToken,
          createdAt: newUser.createdAt,
          profilePic,
        },
      });
    } catch (err) {
      return next(customErrorHandler.serverError("User Creation Failed"));
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
          fullName: existUser.fullName,
          email: existUser.email,
          accessToken: generateToken,
          createdAt: existUser.createdAt,
          profilePic: existUser.profilePic,
        },
      });
    } catch (err) {
      return next(customErrorHandler.serverError("Login Failed"));
    }
  },

  async logout(req, res, next) {
    try {
      return res
        .status(200)
        .json({ success: true, msg: "Logged out Successfully" });
    } catch (err) {
      return next(customErrorHandler.serverError("Logout Failed"));
    }
  },

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { fullName, profilePic } = req.body;
      if (!fullName || !profilePic)
        return next(customErrorHandler.missingField("All fields are required"));
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          fullName,
          profilePic,
        },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        msg: "User Updated Successfully",
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          profilePic: updatedUser.profilePic,
          createdAt: updatedUser.createdAt,
        },
      });
    } catch (err) {
      return next(customErrorHandler.serverError("Failed To Update"));
    }
  },
  async checkAuth(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({
        success: true,
        user,
      });
    } catch (err) {
      return next(customErrorHandler.serverError("Cannot get User details"));
    }
  },
};
module.exports = authController;
