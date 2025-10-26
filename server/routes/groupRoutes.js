import express from "express";
import groupController from "../controllers/groupController.js";
import { parser } from "../src/config/cloudinary.js";

const router = express.Router();

// Get all groups
router.get("/", groupController.getAllGroups);

// Get a single group by ID
router.get("/:id", groupController.getGroupById);

// Get group by name
router.get("/name/:name", groupController.getGroupByName);

// Create a new group with optional cover image
router.post("/create", parser.single("image"), groupController.createGroup);

// Update a group
router.put("/:id", groupController.updateGroup);

// Delete a group
router.delete("/:id", groupController.deleteGroup);

// Join a group
router.post("/:id/join", groupController.joinGroup);

// Leave a group
router.post("/:id/leave", groupController.leaveGroup);

// Toggle admin status for a member
router.post("/:id/admin", groupController.updateAdmin);

// Get all group members
router.get("/:id/members", groupController.getMembers);

// Get all join requests (for private groups)
router.get("/:id/requests", groupController.getJoinRequests);

// Approve a join request
router.post("/:id/requests/approve", groupController.approveJoinRequest);

// Reject a join request
router.post("/:id/requests/reject", groupController.rejectJoinRequest);

export default router;
