const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Group name is mandatory'],
        minlength: [3,'Group name must be at least 3 digits'],
        maxlength: [50, 'Group name must be last ther 50 digits'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [300, 'Group description must be less then 300 digits'],
        defsult: ''
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true
    },
    admins: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    members: [{
        user:{
        type: mongoose.Schema.type.ObjectId,
        ref: 'User'
    },
    joinedAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member'
    }
    }],
    joinRequests: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        requestedAt: {
            type: Date,
            default: Date.now
        },
    }],
    privacy: {
        type: String,
        enum: ['private', 'public'],
        required: [true, 'privacy is mandatory'],
        default: 'public'
    },
    category:{
        type: String,
        enum: ["Adventure", "CityTrip", "Nature", "Luxury", "Backpacking", "FoodAndDrink",
            "Cultural", "Family", "Couples", "SoloTravel", "Budget", "Wellness", "RoadTrip"]
    },
    rules: [{
        type: String,
        maxlength: [200, 'Rule cannot exceed 200 characters']
    }],
    coverImageUrl: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: true
    }
}
, {
  timestamps: true
});