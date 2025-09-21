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

        group.members.push({ user: userId, role: 'member' });
        await group.save();
        return group;
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
}

export default new GroupService();
