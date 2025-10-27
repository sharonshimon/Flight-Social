import express from "express";
import {
    createPostController,
    updatePostController,
    deletePostController,
    likeAndDislikeController,
    getPostController,
    getTimelinePostsController,
    getAllPostsController,
    getPostsByTagController,
    getPostsByUserIdContoller,
    addCommentController,
    updateCommentController,
    deleteCommentFromPostController,
} from "../controllers/postController.js";
import { parser } from "../src/config/cloudinary.js";

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

// Get posts by tag
router.get("/", getPostsByTagController);

// Get posts by userId
router.get("/:userId", getPostsByUserIdContoller);

// Add comment
router.post("/add-comment/:id", addCommentController);
// Update comment
router.put("/update-comment/:id", updateCommentController);
// Delete comment
router.delete("/delete-comment/:id", deleteCommentFromPostController);

export default router;