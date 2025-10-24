
import PostModel from "../models/Post.js";
import UserModel from "../models/User.js";
import GroupModel from "../models/Group.js";
import { cloudinary } from "../src/config/cloudinary.js";

// Create Post
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

        let groupId = null;
        if (body.group) {
            const group = await GroupModel.findOne({ name: body.group });
            if (group) groupId = group._id;
        }

        // Ensure isAnonymous is boolean (FormData sends strings)
        const isAnon = (function (v) {
            if (v === true || v === false) return v;
            if (typeof v === 'string') return v === 'true';
            return false;
        })(body.isAnonymous);

        const newPost = new PostModel({
            ...body,
            isAnonymous: isAnon,
            media: mediaData,
            links: body.links || [],
            tags: body.tags || [],
            group: groupId
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

        const updatableFields = ["content", "tags", "privacy", "links", "isAnonymous", "group"];
        for (const field of updatableFields) {
            if (field === "group") {
                if (body.group) {
                    const group = await GroupModel.findOne({ name: body.group });
                    post.group = group ? group._id : null;
                } else {
                    post.group = null;
                }
            } else if (body[field] !== undefined) {
                // Coerce isAnonymous to boolean
                if (field === 'isAnonymous') {
                    const v = body[field];
                    post.isAnonymous = (v === true || v === 'true');
                } else {
                    post[field] = body[field];
                }
            }
        }

        // update media only if new files are provided
        if (files && files.length > 0) {
            if (post.media && post.media.length > 0) {
                for (const m of post.media) {
                    await cloudinary.uploader.destroy(m.public_id, {
                        resource_type: m.type
                    });
                }
            }

            post.media = files.map(f => ({
                type: f.mimetype.startsWith("video") ? "video" : "image",
                url: f.path,
                filename: f.originalname,
                public_id: f.filename
            }));
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

        if (post.media?.length) {
            for (const m of post.media) {
                if (m.public_id) await cloudinary.uploader.destroy(m.public_id, { resource_type: m.type });
            }
        }

        await post.deleteOne();
        return post;
    } catch (error) {
        throw error;
    }
};

// Get posts by tag (both enum tags and hashtags in content)
export const getPostsByTag = async (tag) => {
    try {
        // Use $regex for content hashtags and direct match for enum tags
        const posts = await PostModel.find({
            $or: [
                { tags: tag }, // enum tags
                { content: { $regex: `#${tag}`, $options: "i" } } // hashtags in content
            ]
        })
            .sort({ createdAt: -1 })
            .populate({ path: 'comments.userId', select: 'username profilePicture' });

        return posts.map(formatComments); // reuse existing formatting
    } catch (error) {
        throw error;
    }
};

// Like / Dislike 
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

// Format Post with Comments 
export const formatComments = (post) => {
    const comments = post.comments.map(comment => {
        //placeholder for user
        if (comment.isAnonymous) {
            return {
                commentId: comment.commentId,
                content: comment.content,
                createdAt: comment.createdAt,
                userId: comment.userId ? comment.userId._id || comment.userId : null, // חשוב להשאיר userId גם לאנונימי
                username: "Anonymous",
                profilePicture: null
            };
        } else {
            return {
                commentId: comment.commentId,
                content: comment.content,
                createdAt: comment.createdAt,
                userId: comment.userId._id || comment.userId,
                username: comment.userId.username,
                profilePicture: comment.userId.profilePicture || null
            };
        }
    });

    return { ...post.toObject(), comments };
};

// Get Post with Comments
export const getPostWithComments = async (params) => {
    try {
        const post = await PostModel.findById(params.id).populate({
            path: 'comments.userId',
            select: 'username profilePicture'
        });

        if (!post) throw new Error("Post not found");
        return formatComments(post);
    } catch (error) {
        throw error;
    }
};

// Get Timeline Posts
export const getTimelinePosts = async (params) => {
    try {
        const currentUser = await UserModel.findOne({ username: params.username });
        if (!currentUser) throw new Error("User not found");

        const userPosts = await PostModel.find({ userId: currentUser._id })
            .sort({ createdAt: -1 })
            .populate({ path: "userId", select: "username profilePicture" })
            .populate({ path: 'comments.userId', select: 'username profilePicture' });


        const timelinePostsArr = await Promise.all(
            currentUser.followings.map(friendId =>
                PostModel.find({ userId: friendId })
                    .sort({ createdAt: -1 })
                    .populate({ path: "userId", select: "username profilePicture" })
                    .populate({ path: "comments.userId", select: "username profilePicture" })
            )
        );

        return userPosts.concat(...timelinePostsArr).map(formatComments);
    } catch (error) {
        throw error;
    }
};

// Get All Posts 
export const getAllPosts = async () => {
    try {
        const posts = await PostModel.aggregate([{ $sample: { size: 40 } }]);
        const populatedPosts = await PostModel.find({ _id: { $in: posts.map(p => p._id) } })
            .populate({ path: 'comments.userId', select: 'username profilePicture' });

        return populatedPosts.map(formatComments);
    } catch (error) {
        throw error;
    }
};

// Comments Management
// Add Comment
export const addComment = async (params, body) => {
    const post = await PostModel.findById(params.id);
    if (!post) throw new Error("Post not found");

    const user = await UserModel.findById(body.userId);
    if (!user) throw new Error("User not found");

    const newComment = {
        postId: post._id,
        userId: user._id,
        isAnonymous: (body.isAnonymous === true || body.isAnonymous === 'true') || false,
        content: body.content
    };

    post.comments.push(newComment);
    await post.save();
    await post.populate({ path: 'comments.userId', select: 'username profilePicture' });

    return formatComments(post);
};

// Update Comment
export const updateComment = async (params, body) => {
    const post = await PostModel.findById(params.id);
    if (!post) throw new Error("Post not found");

    const comment = post.comments.find(c => c.commentId === body.commentId);
    if (!comment) throw new Error("Comment not found");

    //only the owner of the comment (not anonymous) or admin can update
    if (comment.isAnonymous) throw new Error("Cannot edit anonymous comment");
    if (String(comment.userId) !== body.userId && !body.isAdmin) {
        throw new Error("You can update only your comment");
    }

    if (body.content !== undefined) comment.content = body.content;
    if (body.isAnonymous !== undefined) comment.isAnonymous = (body.isAnonymous === true || body.isAnonymous === 'true');

    await post.save();
    await post.populate({ path: 'comments.userId', select: 'username profilePicture' });

    return formatComments(post);
};

// Delete Comment
export const deleteCommentFromPost = async (params, body) => {
    const post = await PostModel.findById(params.id);
    if (!post) throw new Error("Post not found");

    const comment = post.comments.find(c => c.commentId === body.commentId);
    if (!comment) throw new Error("Comment not found");

    //only the owner of the comment (not anonymous) or admin can delete
    if (comment.isAnonymous) throw new Error("Cannot delete anonymous comment");
    if (String(comment.userId) !== body.userId && !body.isAdmin) {
        throw new Error("You can delete only your comment");
    }

    post.comments = post.comments.filter(c => c.commentId !== body.commentId);

    await post.save();
    await post.populate({ path: 'comments.userId', select: 'username profilePicture' });

    return formatComments(post);
};

