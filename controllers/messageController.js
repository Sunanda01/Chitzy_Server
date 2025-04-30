const User = require("../models/UserModel");
const Message = require("../models/MessageModel");
const customErrorHandler = require("../services/customErrorHandler");
const { getReceiverSocketId, io } = require("../services/socket");
const messageController = {
  async getUserForSidebar(req, res, next) {
    try {
      const loggedInUserId = req.user.id;
      const filteredUser = await User.find({
        _id: { $ne: loggedInUserId },
      }).select("-password -updatedAt -createdAt -__v");
      return res.status(200).json({ success: true, filteredUser });
    } catch (err) {
      return next(customErrorHandler.serverError("Failed To Fetched Users"));
    }
  },
  async getMessages(req, res, next) {
    try {
      const { id: clientId } = req.params;
      const userId = req.user.id;
      const messages = await Message.find({
        $or: [
          { senderId: userId, receiverId: clientId },
          { senderId: clientId, receiverId: userId },
        ],
      }).select("-updatedAt -__v");
      return res.status(200).json({ success: true, messages });
    } catch (err) {
      return next(
        customErrorHandler.serverError("Failed To Fetch Previous Messages")
      );
    }
  },
  async sendMessage(req, res, next) {
    try {
      const { text, image } = req.body;
      const { id: clientId } = req.params;
      const userId = req.user.id;
      if (!userId || !clientId) {
        return res.status(400).json({ error: "Missing fields" });
      }
      const newMessage = new Message({
        senderId: userId,
        receiverId: clientId,
        text,
        image,
      });
      await newMessage.save();
      const receiverSocketId = getReceiverSocketId(clientId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      return res.status(200).json({ success: true, messages: newMessage });
    } catch (err) {
      return next(customErrorHandler.serverError("Failed To Send Message"));
    }
  },
};

module.exports = messageController;
