// import groupService from "../services/groupService.js";
// import { verifyToken } from "../services/authService.js";

// class GroupController {
//   // Create a new group
//   async createGroup(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const { name, bio, privacy } = req.body;
//       const creator = userData.id;
//       let coverImageUrl = req.body.coverImageUrl;

//       if (req.file) {
//         coverImageUrl = req.file.path || req.file.url || req.file.secure_url;
//       }

//       const group = await groupService.createGroup({
//         name,
//         bio,
//         privacy,
//         coverImageUrl,
//         creator
//       });

//       res.status(201).json({ success: true, group });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Get all groups
//   async getAllGroups(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const groups = await groupService.getAllGroups();
//       res.status(200).json({ success: true, groups });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   // Get group by ID
//   async getGroupById(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const group = await groupService.getGroupById(req.params.id);
//       if (!group) return res.status(404).json({ success: false, message: "Group not found" });
//       res.status(200).json({ success: true, group });
//       console.log("Fetched group:", group);

//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   // Get group by name
//   async getGroupByName(req, res) {
//     try {
//       const group = await groupService.getGroupByName(req.params.name);
//       if (!group) return res.status(404).json({ success: false, message: "Group not found" });
//       res.status(200).json({ success: true, group });
//     } catch (err) {
//       res.status(500).json({ success: false, message: err.message });
//     }
//   }

//   // Update group
//   async updateGroup(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const group = await groupService.getGroupById(req.params.id);

//       if (!group) return res.status(404).json({ success: false, message: "Group not found" });
//       if (group.creator.toString() !== userData.id && !userData.isAdmin) {
//         return res.status(403).json({ success: false, message: "You can only update your own group" });
//       }

//       const updatedGroup = await groupService.updateGroup(req.params.id, req.body);
//       res.status(200).json({ success: true, group: updatedGroup });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Delete group
//   async deleteGroup(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const group = await groupService.getGroupById(req.params.id);

//       if (!group) return res.status(404).json({ success: false, message: "Group not found" });
//       if (group.creator.toString() !== userData.id && !userData.isAdmin) {
//         return res.status(403).json({ success: false, message: "You can only delete your own group" });
//       }

//       await groupService.deleteGroup(req.params.id);
//       res.status(200).json({ success: true, message: "Group deleted successfully" });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Join group
//   async joinGroup(req, res) {
//     try {
//       const { id } = req.params; // groupId
//       const { userId } = req.body;

//       const { group, status } = await groupService.joinGroup(id, userId);
//       return res.status(200).json({ group, status });
//     } catch (err) {
//       console.error(err.message);
//       return res.status(400).json({ message: err.message });
//     }
//   }

//   // Leave group
//   async leaveGroup(req, res) {
//     try {
//       const { id } = req.params; // groupId
//       const { userId } = req.body;

//       const group = await groupService.leaveGroup(id, userId);
//       return res.status(200).json({ group });
//     } catch (err) {
//       console.error(err.message);
//       return res.status(400).json({ message: err.message });
//     }
//   }

//   // Approve join request
//   async approveJoinRequest(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const group = await groupService.getGroupById(req.params.id);

//       if (group.privacy !== "private") {
//         return res.status(400).json({ success: false, message: "Only private groups use join requests" });
//       }

//       if (!group.admins.some(a => a.toString() === userData.id) && group.creator.toString() !== userData.id) {
//         return res.status(403).json({ success: false, message: "Only admins can approve requests" });
//       }

//       const updatedGroup = await groupService.approveJoinRequest(req.params.id, req.body.userId);
//       res.status(200).json({ success: true, group: updatedGroup });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Reject join request
//   async rejectJoinRequest(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const group = await groupService.getGroupById(req.params.id);

//       if (group.privacy !== "private") {
//         return res.status(400).json({ success: false, message: "Only private groups use join requests" });
//       }

//       if (!group.admins.some(a => a.toString() === userData.id) && group.creator.toString() !== userData.id) {
//         return res.status(403).json({ success: false, message: "Only admins can reject requests" });
//       }

//       const updatedGroup = await groupService.rejectJoinRequest(req.params.id, req.body.userId);
//       res.status(200).json({ success: true, group: updatedGroup });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Get join requests
//   async getJoinRequests(req, res) {
//     try {
//       const userData = verifyToken(req);

//       const group = await groupService.getGroupById(req.params.id);

//       if (group.privacy !== "private") {
//         return res.status(400).json({ success: false, message: "Only private groups have join requests" });
//       }

//       const populatedGroup = await groupService.getJoinRequests(req.params.id);
//       res.status(200).json({ success: true, joinRequests: populatedGroup.joinRequests });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Update admin status
//   async updateAdmin(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const group = await groupService.getGroupById(req.params.id);

//       if (group.creator.toString() !== userData.id && !userData.isAdmin) {
//         return res.status(403).json({ success: false, message: "Only the creator or admins can toggle member roles" });
//       }

//       const updatedGroup = await groupService.updateAdmin(req.params.id, req.body.userId);
//       res.status(200).json({ success: true, group: updatedGroup });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   }

//   // Get group members
//   async getMembers(req, res) {
//     try {
//       const userData = verifyToken(req);
//       const group = await groupService.getMembers(req.params.id);
//       res.status(200).json({ success: true, members: group.members });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
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
      const { name, bio, privacy } = req.body;
      const creator = userData.id;
      let coverImageUrl = req.body.coverImageUrl;

      if (req.file) {
        coverImageUrl = req.file.path || req.file.url || req.file.secure_url;
      }

      const group = await groupService.createGroup({
        name,
        bio,
        privacy,
        coverImageUrl,
        creator,
      });

      res.status(201).json({ success: true, group });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Get all groups
  async getAllGroups(req, res) {
    try {
      verifyToken(req);
      const groups = await groupService.getAllGroups();
      res.status(200).json({ success: true, groups });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get group by ID
  async getGroupById(req, res) {
    try {
      verifyToken(req);
      const group = await groupService.getGroupById(req.params.id);
      if (!group)
        return res
          .status(404)
          .json({ success: false, message: "Group not found" });

      res.status(200).json({ success: true, group });
      console.log("Fetched group:", group);
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  // Get group by name
  async getGroupByName(req, res) {
    try {
      const group = await groupService.getGroupByName(req.params.name);
      if (!group)
        return res
          .status(404)
          .json({ success: false, message: "Group not found" });
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

      if (!group)
        return res
          .status(404)
          .json({ success: false, message: "Group not found" });
      if (group.creator.toString() !== userData.id && !userData.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You can only update your own group",
        });
      }

      const updatedGroup = await groupService.updateGroup(
        req.params.id,
        req.body
      );
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

      if (!group)
        return res
          .status(404)
          .json({ success: false, message: "Group not found" });
      if (group.creator.toString() !== userData.id && !userData.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "You can only delete your own group",
        });
      }

      await groupService.deleteGroup(req.params.id);
      res
        .status(200)
        .json({ success: true, message: "Group deleted successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Join a group
  async joinGroup(req, res) {
    try {
      const { id } = req.params; // groupId
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const { group, status } = await groupService.joinGroup(id, userId);
      return res.status(200).json({ group, status });
    } catch (err) {
      console.error("Join group error:", err.message);
      return res.status(400).json({ message: err.message });
    }
  }

  // Leave a group
  async leaveGroup(req, res) {
    try {
      const { id } = req.params; // groupId
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const group = await groupService.leaveGroup(id, userId);
      return res.status(200).json({ group });
    } catch (err) {
      console.error("Leave group error:", err.message);
      return res.status(400).json({ message: err.message });
    }
  }

  // Approve join request
  async approveJoinRequest(req, res) {
    try {
      const userData = verifyToken(req);
      const group = await groupService.getGroupById(req.params.id);

      if (group.privacy !== "private") {
        return res.status(400).json({
          success: false,
          message: "Only private groups use join requests",
        });
      }

      const isAdminOrCreator =
        group.admins.some((a) => a.toString() === userData.id) ||
        group.creator.toString() === userData.id;

      if (!isAdminOrCreator) {
        return res.status(403).json({
          success: false,
          message: "Only admins can approve requests",
        });
      }

      const updatedGroup = await groupService.approveJoinRequest(
        req.params.id,
        req.body.userId
      );
      res.status(200).json({ success: true, group: updatedGroup });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Reject join request
  async rejectJoinRequest(req, res) {
    try {
      const userData = verifyToken(req);
      const group = await groupService.getGroupById(req.params.id);

      if (group.privacy !== "private") {
        return res.status(400).json({
          success: false,
          message: "Only private groups use join requests",
        });
      }

      if (
        !group.admins.some((a) => a.toString() === userData.id) &&
        group.creator.toString() !== userData.id
      ) {
        return res.status(403).json({
          success: false,
          message: "Only admins can reject requests",
        });
      }

      const updatedGroup = await groupService.rejectJoinRequest(
        req.params.id,
        req.body.userId
      );
      res.status(200).json({ success: true, group: updatedGroup });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Get join requests
  async getJoinRequests(req, res) {
    try {
      verifyToken(req);
      const group = await groupService.getGroupById(req.params.id);

      if (group.privacy !== "private") {
        return res.status(400).json({
          success: false,
          message: "Only private groups have join requests",
        });
      }

      const populatedGroup = await groupService.getJoinRequests(req.params.id);
      res
        .status(200)
        .json({ success: true, joinRequests: populatedGroup.joinRequests });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // Update admin status
  async updateAdmin(req, res) {
    try {
      const userData = verifyToken(req);
      const group = await groupService.getGroupById(req.params.id);

      if (group.creator.toString() !== userData.id && !userData.isAdmin) {
        return res.status(403).json({
          success: false,
          message: "Only the creator or admins can toggle member roles",
        });
      }

      const updatedGroup = await groupService.updateAdmin(
        req.params.id,
        req.body.userId
      );
      res.status(200).json({ success: true, group: updatedGroup });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }

  // // Get list of user's groups
  // async getGroupsByUserId(req, res) {
  //   try {
  //     const { userId } = req.params;
  //     console.log("getGroupsByUserId called with userId:", userId); // בדיקה

  //     const groups = await groupService.getGroupsByUserId(userId);
  //     res.status(200).json(groups);
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // };

  // groupController.js
  async getGroupsByUserId(req, res) {
    try {
      const { userId } = req.params;
      console.log("getGroupsByUserId called with userId:", userId);

      const groups = await groupService.getGroupsByUserId(userId);
      res.status(200).json({ groups }); // שליחה כ-object עם key
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  // Get group members
  async getMembers(req, res) {
    try {
      verifyToken(req);
      const group = await groupService.getMembers(req.params.id);
      res.status(200).json({ success: true, members: group.members });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  }
}

export default new GroupController();
