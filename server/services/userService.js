import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

// Update user info
export const updateUser = async (userId, updateData) => {
    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    return await UserModel.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
};

// Update profile picture
export const updateProfilePicture = async (userId, newProfilePicture) => {
    return await UserModel.findByIdAndUpdate(userId, { $set: { profilePicture: newProfilePicture } }, { new: true });
};

// Delete user
export const deleteUser = async (userId) => {
    await UserModel.findByIdAndDelete(userId);
};

// Get user by ID
export const getUser = async (userId) => {
    return await UserModel.findById(userId);
};

// Get user by username
export const getUserProfile = async (query) => {
    return await UserModel.findOne({ username: query.username });
};

// Follow user
export const followUser = async (userdata, updateData) => {
    if (userdata.id === updateData.id) throw new Error("You cannot follow yourself");

    const user = await UserModel.findById(userdata.id);
    const currentUser = await UserModel.findById(updateData.id);

    if (!user.followings.includes(updateData.id)) {
        await currentUser.updateOne({ $push: { followers: userdata.id } });
        await user.updateOne({ $push: { followings: updateData.id } });
        return { user, currentUser };
    } else {
        throw new Error("You have already followed this user");
    }
};

// Unfollow user
export const unfollowUser = async (userdata, updateData) => {
    if (userdata.id === updateData.id) throw new Error("You cannot unfollow yourself");

    const user = await UserModel.findById(userdata.id);
    const currentUser = await UserModel.findById(updateData.id);

    if (user.followings.includes(updateData.id)) {
        await currentUser.updateOne({ $pull: { followers: userdata.id } });
        await user.updateOne({ $pull: { followings: updateData.id } });
        return { user, currentUser };
    } else {
        throw new Error("You don't follow this user");
    }
};

// Get friends (users the current user follows)
export const getUserFriends = async (userId) => {
    const user = await UserModel.findById(userId);
    const friends = await Promise.all(user.followings.map(friendId => UserModel.findById(friendId)));

    return friends.map(friend => ({
        _id: friend._id,
        username: friend.username,
        profilePicture: friend.profilePicture
    }));
};

// Get all users (admin use) - exclude password
export const getAllUsers = async () => {
    const users = await UserModel.find({}, { password: 0 }).lean();
    return users;
};
