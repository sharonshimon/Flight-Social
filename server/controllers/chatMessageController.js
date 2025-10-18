import ChatMessage from '../models/ChatMessage.js';

// Get all chat messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().lean();
    res.status(200).json({ data: messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a chat message
export const createMessage = async (req, res) => {
  try {
    const message = await ChatMessage.create(req.body);
    res.status(201).json({ data: message });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};