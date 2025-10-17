import express from "express";
import {
    deleteUserController,
    followUserController,
    getUserController,
    getUserFriendsController,
    getUserProfileController,
    getAllUsersController,
    unfollowUserController,
    updateProfilePictureController,
    updateUserController
} from "../controllers/userController.js";
import { cloudinary, parser } from "../src/config/cloudinary.js";

const router = express.Router();

// Update user
router.put("/:id", updateUserController);

// Update profile picture
router.put("/:id/profile-picture", parser.single("profilePicture"), updateProfilePictureController);

// Delete user
router.delete("/:id", deleteUserController);
// Admin: get all users
router.get("/all", getAllUsersController);

// Follow a user
router.put("/follow/:id", followUserController);

// Unfollow a user
router.put("/unfollow/:id", unfollowUserController);

// Get friends
router.get("/friends/:userId", getUserFriendsController);

// Get user by ID
router.get("/:id", getUserController);

// Get user by username
router.get("/", getUserProfileController);

export default router;
