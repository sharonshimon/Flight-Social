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
    minlength: [6, 'Password must be at least 6 characters'],
    maxlength: [20, 'Password must be less than 20 characters']
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
    default: ''
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
    default: "Ghana"
  },
  city: {
    type: String,
    default: "Accra"
  },
  relationship: {
    type: Number,
    enum: [1, 2, 3],
    default: 1
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  followings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
