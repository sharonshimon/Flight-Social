import express from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";
import groupRoutes from "./groupRoutes.js";

const router = express.Router();
const baseURL = "api/v1";

// connect routes
router.use(`/${baseURL}/users`, userRoutes);
router.use(`/${baseURL}/auth`, authRoutes);
router.use(`/${baseURL}/posts`, postRoutes);
router.use(`/${baseURL}/groups`, groupRoutes);

export default router;
