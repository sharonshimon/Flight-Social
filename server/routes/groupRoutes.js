import express from "express";
import groupController from "../controllers/groupController.js";

const router = express.Router();

// Public routes
router.get("/", groupController.getAllGroups);
router.get("/:id", groupController.getGroupById);

// Protected routes
router.post("/", groupController.createGroup);
router.put("/:id", groupController.updateGroup);
router.delete("/:id", groupController.deleteGroup);

export default router;
