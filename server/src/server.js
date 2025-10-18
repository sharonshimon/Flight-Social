// const app = require('./app');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const PORT = process.env.PORT || 3000;
// const MONGO_URI = process.env.MONGO_URI;

// console.log("MONGO_URI:", process.env.MONGO_URI);

// mongoose.connect(MONGO_URI)
//   .then(() => {
//     console.log('MongoDB connected ✅');
//     app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
//   })
//   .catch(err => console.error('DB connection error', err));

// // const User = mongoose.model('User', userSchema);
// // module.exports = User;

// server.js
import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { dbConnect } from "./config/db.js";
import { cloudinary, parser } from "./config/cloudinary.js";
import routes from "../routes/routes.js";
import { setupSocket } from "./socket.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan("common"));
app.use(cors());
app.use(express.json());
// Support URL-encoded form bodies (e.g., from forms) and plain text bodies as a fallback
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: ['text/*', 'application/x-www-form-urlencoded'] }));

// Routes
app.use(routes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Start server after DB connection and attach socket.io
dbConnect()
  .then(() => {
    const server = http.createServer(app);
    const io = setupSocket(server);
    server.listen(PORT, () => {
      console.log(`Server + Socket.io running on http://localhost:${PORT} ✅`);
    });
  })
  .catch((err) => {
    console.error("DB connection error ❌", err);
  });
