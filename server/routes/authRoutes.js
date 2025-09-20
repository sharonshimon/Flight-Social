import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();

// Register new user
router.post("/register", register);

// Login existing user
router.post("/login", login);

export default router;
