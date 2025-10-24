import {
    deleteUser,
    followUser,
    getUser,
    getUserFriends,
    getUserFollowers,
    getUserProfile,
    unfollowUser,
    updateProfilePicture,
    updateUser,
} from "../services/userService.js";
import { verifyToken } from "../services/authService.js"; // Import the verifyToken function

// Update user
export const updateUserController = async (req, res) => {
    try {
        const userData = verifyToken(req);

        if (userData.id === req.params.id || userData.isAdmin) {
            const user = await updateUser(req.params.id, req.body);
            res.status(200).json({ user, message: "Account has been updated successfully" });
        } else {
            res.status(403).json({ message: "You can only update your account" });
        }
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Update profile picture
export const updateProfilePictureController = async (req, res) => {
    try {
        verifyToken(req);
        const user = await updateProfilePicture(req.params.id, req.file.path);
        res.status(200).json({ user, message: "Profile picture has been updated successfully" });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Delete user
export const deleteUserController = async (req, res) => {
    try {
        const userData = verifyToken(req);

        if (userData.id === req.params.id || userData.isAdmin) {
            await deleteUser(req.params.id);
            res.status(200).json({ message: "Account has been deleted successfully" });
        } else {
            res.status(403).json({ message: "You can only delete your account" });
        }
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Get user by ID
export const getUserController = async (req, res) => {
    try {
        verifyToken(req);
        const user = await getUser(req.params.id);
        const { password, ...data } = user._doc;
        res.status(200).json({ userInfo: data });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Get user by username
export const getUserProfileController = async (req, res) => {
    try {
        verifyToken(req);
        const user = await getUserProfile(req.query);
        const { password, ...data } = user._doc;
        res.status(200).json({ userInfo: data });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Get all users for admin
export const getAllUsersController = async (req, res) => {
    try {
        // Require authentication to access full user list
        verifyToken(req);
        const users = await (await import('../services/userService.js')).getAllUsers();
        res.status(200).json({ data: users });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Follow user
export const followUserController = async (req, res) => {
    try {
        const userData = verifyToken(req); // verify token
        const updateData = { id: req.params.id };  // the id of the user to follow

        const result = await followUser(userData, updateData);

        res.status(200).json({ message: "User followed successfully", result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Unfollow user
export const unfollowUserController = async (req, res) => {
    try {
        const userData = verifyToken(req); // verify token
        const updateData = { id: req.params.id }; // the id of the user to unfollow

        const result = await unfollowUser(userData, updateData);

        res.status(200).json({ message: "User unfollowed successfully", result });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get friends
export const getUserFriendsController = async (req, res) => {
    try {
        verifyToken(req);
        const friends = await getUserFriends(req.params.userId);
        res.status(200).json({ friends, message: "Friends fetched successfully" });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};

// Get followers controller
export const getUserFollowersController = async (req, res) => {
    try {
        verifyToken(req);
        const followers = await getUserFollowers(req.params.userId);
        res.status(200).json({ followers, message: "Followers fetched successfully" });
    } catch (err) {
        res.status(401).json({ error: err.message });
    }
};
