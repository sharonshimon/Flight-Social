import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Register User
export const registerUser = async (body) => {
    const existingUser = await UserModel.findOne({ email: body.email });
    if (existingUser) throw new Error("Email already registered");

    const newUser = new UserModel({
        username: body.username,
        email: body.email,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
    });

    await newUser.save();
    return newUser;
};

// Login User
export const loginUser = async (body) => {
    const user = await UserModel.findOne({ email: body.email });
    if (!user) throw new Error("User not found");

    const passwordCheck = await user.comparePassword(body.password);
    if (!passwordCheck) throw new Error("Invalid password, please try again");

    // Generate JWT Token
    const token = jwt.sign(
        { id: user._id, username: user.username, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: "1d" }
    );

    return { user, token };
};

// Verify JWT Token (to be used in controllers)
export const verifyToken = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new Error("Access denied. No token provided");

    const token = authHeader.split(" ")[1];
    if (!token) throw new Error("Access denied. Invalid token");

    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        throw new Error("Invalid token");
    }
};
