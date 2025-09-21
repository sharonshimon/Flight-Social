import express from "express";
import groupController from "../controllers/groupController.js";

const router = express.Router();

// Get all groups
router.get("/", groupController.getAllGroups);

// Get group by ID
router.get("/id/:id", groupController.getGroupById);

// Get group by name
router.get("/name/:name", groupController.getGroupByName);

// Create a new group
router.post("/", groupController.createGroup);

// Update, Delete, Join, Leave group
router.put("/:id", groupController.updateGroup);
router.delete("/:id", groupController.deleteGroup);
router.post("/:id/join", groupController.joinGroup);
router.post("/:id/leave", groupController.leaveGroup);

export default router;
