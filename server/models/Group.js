import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Group name is mandatory'],
        unique: true, // country name
        minlength: [3, 'Group name must be at least 3 characters'],
        maxlength: [50, 'Group name must be less than 50 characters'],
        trim: true
    },
    bio: {
        type: String,
        maxlength: [300, 'Group bio must be less than 300 characters'],
        default: ''
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    admins: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    members: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        joinedAt: { type: Date, default: Date.now },
        role: { type: String, enum: ['member', 'admin'], default: 'member' }
    }],
    joinRequests: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        requestedAt: { type: Date, default: Date.now }
    }],
    privacy: {
        type: String,
        enum: ['private', 'public'],
        required: [true, 'Privacy is mandatory'],
        default: 'public'
    },
    coverImageUrl: {
        type: String,
        default: "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
    },
    isActive: { type: Boolean, default: true },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }]
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);
