const ChatMessage = require('../model/chatMessage');

// Get all chat messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a chat message
exports.createMessage = async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};