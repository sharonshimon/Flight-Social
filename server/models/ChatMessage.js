
import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatMessageSchema = new Schema({
  senderId: {
    type: String,
    required: true,
    index: true
  },
  senderName: {
    type: String,
    required: true
  },
  receiverId: {
    type: String,
    index: true
  },
  receiverName: {
    type: String
  },
  // Optional username when a message is started by username instead of id
  peerUsername: {
    type: String,
    index: true,
    sparse: true
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  messageType: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  editedAt: {
    type: Date
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model('ChatMessage', chatMessageSchema);
