import { loginUser, registerUser } from "../services/authService.js";
import { parser } from "../src/config/cloudinary.js";

// Register Controller
export const register = async (req, res) => {
    try {
        const newUser = await registerUser(req.body, req.file);
        const { password, ...userData } = newUser._doc;

        res.status(201).json({
            message: "User has been registered successfully",
            user: userData,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || "Error occurred registering user",
        });
    }
};

// Login Controller
export const login = async (req, res) => {
    try {
        const { user, token } = await loginUser(req.body);
        const { password, ...userData } = user._doc;

        res.status(200).json({
            message: "User logged in successfully",
            user: userData,
            token,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message || "Error occurred logging in the user",
        });
    }
};
