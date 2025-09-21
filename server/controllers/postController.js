
import {
  createPost,
  updatePost,
  deletePost,
  likeAndDislike,
  getPostWithComments,
  getTimelinePosts,
  getAllPosts,
  getPostsByTag
} from "../services/postService.js";
import { verifyToken } from "../services/authService.js";

// Create Post
export const createPostController = async (req, res) => {
  try {
    const userData = verifyToken(req);
    const newPost = await createPost(
      { ...req.body, userId: userData.id },
      req.files
    );
    res.status(200).json({ data: newPost, message: "Post has been created successfully" });
  } catch (err) {
    res.status(401).json({ data: null, message: "Post creation failed", error: err.message });
  }
};

// Update Post
export const updatePostController = async (req, res) => {
  try {
    const userData = verifyToken(req);

    const updatedPost = await updatePost(
      req.params,
      {
        ...req.body,
        userId: userData.id,
        isAdmin: userData.isAdmin,
      },
      req.files
    );

    res.status(200).json({
      data: updatedPost,
      message: "Post has been updated successfully"
    });
  } catch (err) {
    res.status(401).json({
      data: null,
      message: "Post update failed",
      error: err.message
    });
  }
};

// Delete Post
export const deletePostController = async (req, res) => {
  try {
    const userData = verifyToken(req);
    const deletedPost = await deletePost(req.params, {
      userId: userData.id,
      isAdmin: userData.isAdmin
    });
    res.status(200).json({ data: deletedPost, message: "Post has been deleted successfully" });
  } catch (err) {
    res.status(400).json({ data: null, message: "Post deletion failed", error: err.message });
  }
};

// Like / Dislike
export const likeAndDislikeController = async (req, res) => {
  try {
    const userData = verifyToken(req);
    const post = await likeAndDislike(req.params, { userId: userData.id });
    res.status(200).json({ data: post, message: "Like/Dislike action completed" });
  } catch (err) {
    res.status(400).json({ data: null, message: "Like/Dislike action failed", error: err.message });
  }
};

// Get Post with Comments
export const getPostController = async (req, res) => {
  try {
    verifyToken(req);
    const post = await getPostWithComments(req.params);
    res.status(200).json({ data: post, message: "Post fetched successfully" });
  } catch (err) {
    res.status(400).json({ data: null, message: "Post fetch failed", error: err.message });
  }
};

// Get Timeline Posts
export const getTimelinePostsController = async (req, res) => {
  try {
    verifyToken(req);
    const posts = await getTimelinePosts(req.params);
    res.status(200).json({ data: posts, message: "Timeline posts fetched successfully" });
  } catch (err) {
    res.status(400).json({ data: null, message: "Timeline fetch failed", error: err.message });
  }
};

// Get All Posts
export const getAllPostsController = async (req, res) => {
  try {
    verifyToken(req);
    const posts = await getAllPosts();
    res.status(200).json({ data: posts, message: "Posts fetched successfully" });
  } catch (err) {
    res.status(400).json({ data: null, message: "Posts fetch failed", error: err.message });
  }
};

// Get Posts by Tag
export const getPostsByTagController = async (req, res) => {
  try {
    verifyToken(req);
    const tag = req.params.tag;
    const posts = await getPostsByTag(tag);
    res.status(200).json({ data: posts, message: `Posts filtered by tag: ${tag}` });
  } catch (err) {
    res.status(400).json({ data: null, message: "Failed to fetch posts by tag", error: err.message });
  }
};
