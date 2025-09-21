import groupService from "../services/groupService.js";
import { verifyToken } from "../services/authService.js";

class GroupController {

  // Create a new group
  async createGroup(req, res) {
    try {
      const userData = verifyToken(req); // JWT verification
      const { name, bio, privacy, coverImageUrl } = req.body;
      const creator = userData.id;

      const group = await groupService.createGroup({ name, bio, privacy, coverImageUrl, creator });
      res.status(201).json({ success: true, group });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Get all groups
  async getAllGroups(req, res) {
    try {
      const groups = await groupService.getAllGroups();
      res.status(200).json({ success: true, groups });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get group by ID
  async getGroupById(req, res) {
    try {
      const group = await groupService.getGroupById(req.params.id);
      if (!group) return res.status(404).json({ success: false, message: "Group not found" });
      res.status(200).json({ success: true, group });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get group by name
  async getGroupByName(req, res) {
    try {
      const group = await groupService.getGroupByName(req.params.name);
      if (!group) return res.status(404).json({ success: false, message: "Group not found" });
      res.status(200).json({ success: true, group });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Update group
  async updateGroup(req, res) {
    try {
      const userData = verifyToken(req);
      const group = await groupService.getGroupById(req.params.id);

      if (!group) return res.status(404).json({ success: false, message: "Group not found" });
      if (group.creator.toString() !== userData.id && !userData.isAdmin) {
        return res.status(403).json({ success: false, message: "You can only update your own group" });
      }

      const updatedGroup = await groupService.updateGroup(req.params.id, req.body);
      res.status(200).json({ success: true, group: updatedGroup });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Delete group
  async deleteGroup(req, res) {
    try {
      const userData = verifyToken(req);
      const group = await groupService.getGroupById(req.params.id);

      if (!group) return res.status(404).json({ success: false, message: "Group not found" });
      if (group.creator.toString() !== userData.id && !userData.isAdmin) {
        return res.status(403).json({ success: false, message: "You can only delete your own group" });
      }

      await groupService.deleteGroup(req.params.id);
      res.status(200).json({ success: true, message: "Group deleted successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Join group
  async joinGroup(req, res) {
    try {
      const userData = verifyToken(req);
      const group = await groupService.joinGroup(req.params.id, userData.id);
      res.status(200).json({ success: true, group });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Leave group
  async leaveGroup(req, res) {
    try {
      const userData = verifyToken(req);
      const group = await groupService.leaveGroup(req.params.id, userData.id);
      res.status(200).json({ success: true, group });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export default new GroupController();
