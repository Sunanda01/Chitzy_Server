const mongoose = require("mongoose");
const DB_URL = require("../config/config").DB_URL;
const connection = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log("Database Connected Successfully");
  } catch (err) {
    console.error(err);
  }
};
module.exports = connection;
