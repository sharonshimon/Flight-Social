import express from "express";
import { getConversation, listConversations } from "../controllers/chatController.js";
import { startConversation } from "../controllers/chatController.js";

const router = express.Router();

// GET /api/v1/chat/conversations -> list conversations for current user
router.get("/conversations", listConversations);

// GET /api/v1/chat/messages/:userId/:peerId
router.get("/messages/:userId/:peerId", getConversation);

// POST /api/v1/chat/start -> start a conversation with optional first message
router.post('/start', startConversation);

export default router;
