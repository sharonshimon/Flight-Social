import Group from "../models/Group.js";

class GroupService {
    // Create a new group (or return existing group with the same name)
    async createGroup({ name, bio, creator, privacy, coverImageUrl }) {
        // check if group with the same name already exists
        let group = await Group.findOne({ name: name.trim() });
        if (group) {
            return group; // return existing group
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

    // Join group
    async joinGroup(groupId, userId) {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        const isMember = group.members.some(m => m.user.toString() === userId);
        if (isMember) throw new Error("User is already a member");

        // If public group, add directly to members
        if (group.privacy === "public") {
            group.members.push({ user: userId, role: "member" });
            await group.save();
            return { group, status: "joined" };
        }

        // If private group, add to join requests
        const alreadyRequested = group.joinRequests.some(r => r.user.toString() === userId);
        if (alreadyRequested) throw new Error("Join request already sent");

        group.joinRequests.push({ user: userId });
        await group.save();
        return { group, status: "request_sent" };

    }

    // Leave group
    async leaveGroup(groupId, userId) {
        const group = await Group.findById(groupId);
        if (!group) throw new Error("Group not found");

        group.members = group.members.filter(m => m.user.toString() !== userId);
        group.admins = group.admins.filter(a => a.toString() !== userId);

        await group.save();
        return group;
    }

    // Delete a group
    async deleteGroup(groupId) {
        return Group.findByIdAndDelete(groupId);
    }

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
