const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is mandatory'],
    maxlength: [200, 'Comment must be last then 200 characters'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  caption: {
    type: String,
    maxlength: [2000, 'Caption cannot exceed 2000 characters'],
    default: ''
  },
  media: {
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
  tags: [{
    type: String,
    trim: true,
    maxlength: [50, 'Tag must be less then 50 characters']
  }],
  location: {
    type: String,
    maxlength: [100, 'Location must be less then 100 characters'],
    default: ''
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [commentSchema],
  isEdited: {
    type: Boolean,
    default: false
  },
  editHistory: [{
    editedAt: Date,
    oldCaption: String,
    oldTags: [String]
  }],
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
}, 
{ timestamps: true });
