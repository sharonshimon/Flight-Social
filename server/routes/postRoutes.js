import express from "express";
import {
    createPostController,
    deletePostController,
    getAllPostsController,
    getPostController,
    getTimelinePostsController,
    likeAndDislikeController,
    updatePostController,
} from "../controllers/postController.js";
import { cloudinary, parser } from "../src/config/cloudinary.js";

const router = express.Router();

// Create post (support multiple files)
router.post("/create-post", parser.array("media"), createPostController);

// Update post (support multiple files)
router.put("/update-post/:id", parser.array("media"), updatePostController);

// Delete post
router.delete("/delete-post/:id", deletePostController);

// Like and Dislike
router.put("/like-post/:id", likeAndDislikeController);

// Get post
router.get("/get-post/:id", getPostController);

// Get all posts
router.get("/", getAllPostsController);

// Timeline posts
router.get("/get-timeline-posts/:username", getTimelinePostsController);

export default router;
