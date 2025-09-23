import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Username is mandatory'],
    unique: true,
    lowercase: true,
    trim: true,
    minlength: [3, 'Username must be longer than 3 characters'],
    maxlength: [20, 'Username must be less than 20 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is mandatory'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is mandatory'],
    minlength: [8, 'Password must be at least 8 characters'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is mandatory'],
    minlength: [2, 'First name must be at least 2 characters'],
    maxlength: [20, 'First name must be less than 20 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is mandatory'],
    minlength: [2, 'Last name must be at least 2 characters'],
    maxlength: [20, 'Last name must be less than 20 characters']
  },
  profilePicture: {
    type: String,
    //default: ''
    default: "https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE="
  },
  gender: {
    type: String,
    required: [true, 'gender is mandatory'],
    enum: ['Female', 'Male', 'Other'],
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: ''
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  country: {
    type: String,
    default: "Israel"
  },
  city: {
    type: String,
    default: "Jerusalem"
  },
  relationship: {
    type: String,
    enum: ['Single', 'In a relationship', 'Married'],
    default: 'Single'
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // These are the people following you.
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // These are the people you follow.
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
