import Group from "../models/Group.js";

class GroupService {
    // Create a new group (or return existing group with the same name)
    async createGroup({ name, bio, privacy, coverImageUrl, creator }) {
        let group = await Group.findOne({ name: name.trim() });
        if (group) {
            return group;
        }

        if (!coverImageUrl) {
            coverImageUrl = "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE=";
        }

        group = new Group({
            name: name.trim(),
            bio,
            creator,
            privacy,
            coverImageUrl,
            admins: [creator],
            members: [{ user: creator, role: "admin" }]
        });

        await group.save();
        return group;
    }

    // Get all groups
    async getAllGroups() {
        return Group.find().sort({ createdAt: -1 });
    }

    // Get a single group by ID
    async getGroupById(groupId) {
        return Group.findById(groupId);
    }

    // Get a single group by name
    async getGroupByName(groupName) {
        return Group.findOne({ name: groupName });
    }

    // Update a group
    async updateGroup(groupId, updateData) {
        return Group.findByIdAndUpdate(groupId, updateData, { new: true, runValidators: true });
    }

    // joinGroup
    async joinGroup(req, res) {
        try {
            const groupId = req.params.groupId;
            const userId = req.user._id;

            const group = await GroupModel.findById(groupId);
            if (!group) return res.status(404).json({ message: "Group not found" });

            if (group.members.includes(userId)) {
                return res.status(400).json({ message: "User already a member" });
            }

            group.members.push(userId);
            await group.save();

            res.json({ group });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    // leaveGroup
    async leaveGroup(req, res) {
        try {
            const groupId = req.params.groupId;
            const userId = req.user._id;

            const group = await GroupModel.findById(groupId);
            if (!group) return res.status(404).json({ message: "Group not found" });

            group.members = group.members.filter((id) => id.toString() !== userId.toString());
            await group.save();

            res.json({ group });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Server error" });
        }
    };

    // Get list of user's groups
    async getGroupsByUserId(userId) {
        try {
            if (!userId) throw new Error("User ID is required");
            //const groups = await Group.find({ members: userId }).populate("members", "username");
            const groups = await Group.find({ "members.user": userId }).populate("members.user", "username");
            return groups;
        } catch (error) {
            throw new Error("Failed to fetch user groups: " + error.message);
        }
    };

    // Delete a group
    async deleteGroup(groupId) {
        return Group.findByIdAndDelete(groupId);
    };

    // Add 
    // Approve join request
    async approveJoinRequest(groupId, userId) {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        const requestIndex = group.joinRequests.findIndex(r => r.user.toString() === userId);
        if (requestIndex === -1) throw new Error("Join request not found");

        group.members.push({ user: userId, role: "member" });
        group.joinRequests.splice(requestIndex, 1);

        await group.save();
        return group;
    }

    // Reject join request
    async rejectJoinRequest(groupId, userId) {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        group.joinRequests = group.joinRequests.filter(r => r.user.toString() !== userId);
        await group.save();
        return group;
    }

    // Update admin status
    async updateAdmin(groupId, userId) {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        const isAdmin = group.admins.some(a => a.toString() === userId);
        if (isAdmin) {
            group.admins = group.admins.filter(a => a.toString() !== userId);
            const member = group.members.find(m => m.user.toString() === userId);
            if (member) member.role = "member";
        } else {
            group.admins.push(userId);
            const member = group.members.find(m => m.user.toString() === userId);
            if (member) member.role = "admin";
        }

        await group.save();
        return group;
    }

    // Get all members
    async getMembers(groupId) {
        return Group.findById(groupId).populate("members.user", "username email profilePicture");
    }

    // Get all join requests
    async getJoinRequests(groupId) {
        return Group.findById(groupId).populate("joinRequests.user", "username email profilePicture");
    }
}

export default new GroupService();
