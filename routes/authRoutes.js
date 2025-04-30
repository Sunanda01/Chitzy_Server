const authController = require("../controllers/authController");
const verifyToken = require("../middleware/verifyToken");
const routes = require("express").Router();
routes.post("/signup", authController.signup);
routes.post("/login", authController.login);
routes.post("/logout", authController.logout);
routes.put("/update", verifyToken, authController.updateProfile);
routes.get("/check-auth", verifyToken, authController.checkAuth);
module.exports = routes;
