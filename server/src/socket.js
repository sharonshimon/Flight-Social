import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";
import ChatMessage from "../models/ChatMessage.js";

const JWT_SECRET = process.env.JWT_SECRET;

export function setupSocket(server) {
  const io = new SocketServer(server, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  // map of userId -> socketId
  const onlineUsers = new Map();

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication error: token missing"));
      const payload = jwt.verify(token, JWT_SECRET);
      socket.user = payload;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    onlineUsers.set(userId, socket.id);
    console.log(`Socket connected: ${userId} -> ${socket.id}`);

    // join a personal room
    socket.join(`user:${userId}`);

    // handle private message
    socket.on("private_message", async (payload) => {
      try {
        const { to, content, messageType = "text" } = payload;
        // persist message
        const msg = new ChatMessage({
          senderId: userId,
          senderName: socket.user.username || socket.user.username,
          receiverId: to,
          receiverName: payload.toName || "",
          content,
          messageType
        });
        await msg.save();

        // emit to receiver if online
        const receiverSocketId = onlineUsers.get(to);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("private_message", msg);
        }

        // ack back to sender with saved message
        socket.emit("private_message", msg);
      } catch (err) {
        console.error("Failed to handle private_message", err);
        socket.emit("error", { message: "Message send failed" });
      }
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      console.log(`Socket disconnected: ${userId}`);
    });
  });

  return io;
}
