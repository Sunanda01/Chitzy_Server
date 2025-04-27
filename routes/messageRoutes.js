const routes = require("express").Router();
const verifyToken = require("../middleware/verifyToken");
const messageController = require("../controllers/messageController");
routes.get("/users", verifyToken, messageController.getUserForSidebar);
routes.get("/:id", verifyToken, messageController.getMessages);
routes.post("/send/:id", verifyToken, messageController.sendMessage);
module.exports = routes;
