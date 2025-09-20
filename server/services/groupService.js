import Group from "../models/Group.js";

class GroupService {
    // Create a new group (or return existing group with the same name)
    async createGroup({ name, bio, creator, privacy, category, coverImageUrl }) {
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
            category,
            coverImageUrl
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

    // Update a group
    async updateGroup(groupId, updateData) {
        return Group.findByIdAndUpdate(groupId, updateData, { new: true, runValidators: true });
    }

    // Delete a group
    async deleteGroup(groupId) {
        return Group.findByIdAndDelete(groupId);
    }
}

export default new GroupService();
