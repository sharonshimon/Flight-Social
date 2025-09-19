// const mongoose = require('mongoose');

// const commentSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   content: {
//     type: String,
//     required: [true, 'Comment content is mandatory'],
//     maxlength: [200, 'Comment must be last then 200 characters'],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const postSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   media: {
//     type: {
//       type: String,
//       enum: ['image', 'video', 'none'],
//       default: 'none'
//     },
//     url: {
//       type: String,
//       default: ''
//     },
//     filename: {
//       type: String,
//       default: ''
//     }
//   },
//   tags: [{
//     type: String,
//     trim: true,
//     maxlength: [100, 'Tag must be less then 100 characters']
//   }],
//   country: {
//     type: String,
//     maxlength: [100, 'country must be less then 100 characters'],
//     default: ''
//   },
//   likes: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],
//   comments: [commentSchema],
//   isEdited: {
//     type: Boolean,
//     default: false
//   },
//   editHistory: [{
//     editedAt: Date,
//     oldCaption: String,
//     oldTags: [String]
//   }],
//   privacy: {
//     type: String,
//     enum: ['public', 'friends', 'private'],
//     default: 'public'
//   },
//   group: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Group',
//     default: null
//   }
// },
//   { timestamps: true });



import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  commentId: { type: String, required: true, unique: true },
  postId: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userDisplayName: { type: String, default: 'Anonymous' },
  userPhotoURL: { type: String, default: null },
  content: {
    type: String,
    required: [true, 'Comment content is mandatory'],
    maxlength: [200, 'Comment must be less than 200 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  postId: { type: String, required: true, unique: true },  // Unique post identifier
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
  }, media: {
    type: {
      type: String,
      enum: ['image', 'video', 'none'],
      default: 'none'
    },
    url: {
      type: String,
      default: ''
    },
    filename: {
      type: String,
      default: ''
    }
  },
  tags: { type: Array, default: [] },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  // country: {
  //   type: String,
  //   maxlength: [100, 'Country must be less than 100 characters'],
  //   default: ''
  // },
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    editedAt: Date,
    oldCaption: String,
    oldTags: [String]
  }],
  isDeleted: { type: Boolean, default: false },
  privacy: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'public'
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    default: null
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// // Add indexes for better query performance
// postSchema.index({ isDeleted: 1, createdAt: -1 }); // For getAllPosts
// postSchema.index({ author: 1, isDeleted: 1 }); // For getUserPosts
// // Note: postId already has an index due to unique: true constraint

export default mongoose.model("Post", postSchema);
