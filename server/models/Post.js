import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const commentSchema = new mongoose.Schema({
  commentId: { type: String, default: uuidv4 },
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
  postId: { type: String, default: uuidv4, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },

  // media: {
  //   type: {
  //     type: String,
  //     enum: ['image', 'video', 'none'],
  //     default: 'none'
  //   },
  //   url: { type: String, default: '' },
  //   filename: { type: String, default: '' },
  //   public_id: { type: String, default: '' }
  // },

  media: [
    {
      type: {
        type: String,
        enum: ['image', 'video'],
        required: true
      },
      url: { type: String, required: true },
      filename: { type: String, default: '' },
      public_id: { type: String, default: '' }
    }
  ],

  // link: { type: String, default: '' }, // out link preview
  links: { type: [String], default: [] },
  tags: { type: Array, default: [] },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: false, default: null }
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
