// // const Group = require('../models/Group');

// // exports.getAllGroups = async (req, res) => {
// //   try {
// //     const groups = await Group.find();
// //     res.json(groups);
// //   } catch (err) {
// //     res.status(500).json({ error: err.message });
// //   }
// // };

// // exports.createGroup = async (req, res) => {
// //   try {
// //     const group = await Group.create(req.body);
// //     res.status(201).json(group);
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // };

// import groupService from "../services/groupService.js";

// class GroupController {
//   // Create a new group
//   async createGroup(req, res) {
//     try {
//       const { name, bio, privacy, category, coverImageUrl } = req.body;
//       const creator = req.user._id; // Assuming req.user is populated by authentication middleware
//       const group = await groupService.createGroup({ name, bio, privacy, category, coverImageUrl, creator });
//       res.status(201).json({ success: true, group });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Get all groups
//   async getAllGroups(req, res) {
//     try {
//       const groups = await groupService.getAllGroups();
//       res.status(200).json({ success: true, groups });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   // Get group by ID
//   async getGroupById(req, res) {
//     try {
//       const group = await groupService.getGroupById(req.params.id);
//       if (!group) return res.status(404).json({ success: false, message: "Group not found" });
//       res.status(200).json({ success: true, group });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   // Update group
//   async updateGroup(req, res) {
//     try {
//       const updatedGroup = await groupService.updateGroup(req.params.id, req.body);
//       if (!updatedGroup) return res.status(404).json({ success: false, message: "Group not found" });
//       res.status(200).json({ success: true, group: updatedGroup });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Delete group
//   async deleteGroup(req, res) {
//     try {
//       const deletedGroup = await groupService.deleteGroup(req.params.id);
//       if (!deletedGroup) return res.status(404).json({ success: false, message: "Group not found" });
//       res.status(200).json({ success: true, message: "Group deleted successfully" });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }
// }

// export default new GroupController();




import groupService from "../services/groupService.js";
import { verifyToken } from "../services/authService.js";

class GroupController {
  // Create a new group
  async createGroup(req, res) {
    try {
      const userData = verifyToken(req);
      const { name, bio, privacy, category, coverImageUrl } = req.body;
      const creator = userData.id; // from verified token
      const group = await groupService.createGroup({ name, bio, privacy, category, coverImageUrl, creator });
      res.status(201).json({ success: true, group });
    } catch (err) {
      res.status(401).json({ success: false, message: err.message });
    }
  }

  // Get all groups (public)
  async getAllGroups(req, res) {
    try {
      const groups = await groupService.getAllGroups();
      res.status(200).json({ success: true, groups });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get group by ID (public)
  async getGroupById(req, res) {
    try {
      const group = await groupService.getGroupById(req.params.id);
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
      res.status(401).json({ success: false, message: err.message });
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
      res.status(401).json({ success: false, message: err.message });
    }
  }
}

export default new GroupController();
