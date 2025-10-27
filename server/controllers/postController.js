
import {
  createPost,
  updatePost,
  deletePost,
  likeAndDislike,
  getPostWithComments,
  getTimelinePosts,
  getAllPosts,
  getPostsByTag,
  getPostsByUserId,
  addComment,
  updateComment,
  deleteCommentFromPost
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
    const tag = req.query.tag;
    let posts;
    if (!tag) {
      posts = await PostModel.find().sort({ createdAt: -1 });
    } else {
      posts = await PostModel.find({
        $or: [
          { tags: tag },
          { content: { $regex: `#${tag}`, $options: "i" } }
        ]
      }).sort({ createdAt: -1 });
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get posts by userId
export const getPostsByUserIdContoller = async (req, res) => {
  const { userId } = req.params;
  try {
    verifyToken(req);
    const posts = await getPostsByUserId(userId);
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};



// Add Comment
export const addCommentController = async (req, res) => {
  try {
    const comments = await addComment(req.params, req.body);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: "Failed to add comment", error: error.message });
  }
};

// Add Comment Controller
// export const addCommentController = async (req, res) => {
//   try {
//     const post = await addComment(req.params, req.body);
//     res.status(200).json(post);
//   } catch (error) {
//     res.status(400).json({ message: "Failed to add comment", error: error.message });
//   }
// };

// Update Comment
export const updateCommentController = async (req, res) => {
  try {
    const comments = await updateComment(req.params, req.body);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: "Failed to update comment", error: error.message });
  }
};

// Delete Comment
export const deleteCommentFromPostController = async (req, res) => {
  try {
    const comments = await deleteCommentFromPost(req.params, req.body);
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ message: "Failed to delete comment", error: error.message });
  }
};