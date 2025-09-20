import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";
import { cloudinary } from "../src/config/cloudinary.js";

export const createPost = async (body, files) => {
    try {
        const mediaData = files?.length
            ? files.map(file => ({
                type: file.mimetype.startsWith("video") ? "video" : "image",
                url: file.path,
                filename: file.originalname,
                public_id: file.filename || ""
            }))
            : [];

        const newPost = new PostModel({
            ...body,
            media: mediaData,
            links: body.links || [],
        });

        await newPost.save();
        return newPost;
    } catch (error) {
        throw error;
    }
};

// Update Post
export const updatePost = async (params, body, files) => {
    try {
        const post = await PostModel.findById(params.id);
        if (!post) throw new Error("Post not found");

        if (post.userId.toString() !== body.userId && !body.isAdmin) {
            throw new Error("You can update only your post");
        }

        const updatableFields = ["content", "tags", "privacy", "links"];
        for (const field of updatableFields) {
            if (body[field] !== undefined) post[field] = body[field];
        }

        if (files && files.length > 0) {
            for (const file of files) {
                if (post.media?.public_id) {
                    await cloudinary.uploader.destroy(post.media.public_id, {
                        resource_type: post.media.type
                    });
                }

                post.media = files.map(f => ({
                    type: f.mimetype.startsWith("video") ? "video" : "image",
                    url: f.path,
                    filename: f.originalname,
                    public_id: f.filename
                }));
            }
        }

        await post.save();
        return post;
    } catch (error) {
        throw error;
    }
};

// Delete Post
export const deletePost = async (params, body) => {
    try {
        const post = await PostModel.findById(params.id);
        if (!post) throw new Error("Post not found");

        if (post.userId.toString() !== body.userId && !body.isAdmin) {
            throw new Error("You can delete only your post");
        }

        // מחיקת מדיה מ-Cloudinary אם קיימת
        if (post.media && post.media.public_id) {
            await cloudinary.uploader.destroy(post.media.public_id, { resource_type: "auto" });
        }

        await post.deleteOne();

        return post;
    } catch (error) {
        throw error;
    }
};

// Like and Dislike Post
export const likeAndDislike = async (params, body) => {
    try {
        const post = await PostModel.findById(params.id);
        if (!post) throw new Error("Post not found");

        if (post.privacy === "private" && post.userId.toString() !== body.userId) {
            throw new Error("Cannot like/dislike a private post");
        }

        if (!post.likes.includes(body.userId)) {
            post.likes.push(body.userId);
        } else {
            post.likes.pull(body.userId);
        }

        await post.save();
        return post;
    } catch (error) {
        throw error;
    }
};

// Get Post
export const getPost = async (params) => {
    try {
        const post = await PostModel.findById(params.id);
        if (!post) throw new Error("Post not found");
        return post;
    } catch (error) {
        throw error;
    }
};

// Get Timeline Posts
export const getTimelinePosts = async (params) => {
    try {
        const currentUser = await UserModel.findOne({ username: params.username });
        if (!currentUser) throw new Error("User not found");

        const userPosts = await PostModel.find({ userId: currentUser._id }).sort({ createdAt: -1 });

        const timelinePosts = await Promise.all(
            currentUser.followings.map((friendId) =>
                PostModel.find({ userId: friendId }).sort({ createdAt: -1 })
            )
        );

        return userPosts.concat(...timelinePosts);
    } catch (error) {
        throw error;
    }
};

// Get All Posts
export const getAllPosts = async () => {
    try {
        const posts = await PostModel.aggregate([{ $sample: { size: 40 } }]);
        return posts;
    } catch (error) {
        throw error;
    }
};
