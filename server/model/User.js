const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: [true, 'Username is mandatory'], 
        unique: true,
        lowercase:true,
        trim: true,
        minLength: [3, 'Username must be longer then 3 characters'],
        maxlength:[20, 'Username must be less the 20 characters']},
    email: {
        type: String,
        required: [true, 'Email is mandatory'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']},
    password: {
        type: String, 
        required: [true, 'Password is mandatory'],
        lowecase: true,
        minlength: [6, 'Password must be at least 6 characters'],
        maxlength: [20, 'Password must be less then 20 characters']},
    firstName: {
        type: String,
        required: [true, 'first name is mandatory'],
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [20, 'First name must be less then 20 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is mandatory'],
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [20, 'Last name must be less then 20 characters']
    },
    profilePicture: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [200, 'Bio cannot exceed 200 characters'],
    default: ''},
  followers: 
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: 
    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt:
    { type: Date, default: Date.now }
  });