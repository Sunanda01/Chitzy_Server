const cloudinary = require("cloudinary");
const CLOUD_NAME = require("../config/config").CLOUD_NAME;
const API_KEY = require("../config/config").API_KEY;
const API_SECRET = require("../config/config").API_SECRET;
const Cloudinary_Upload=cloudinary.v2.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true,
});
module.exports=Cloudinary_Upload;