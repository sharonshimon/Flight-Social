// dbConnect/dbConnect.js
import mongoose from "mongoose";

export const dbConnect = async () => {
    try {
        const MONGO_URI = process.env.MONGO_URI;
        if (!MONGO_URI) throw new Error("MONGO_URI is not defined in .env");

        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log("MongoDB connected successfully ✅");
    } catch (err) {
        console.error("MongoDB connection error ❌", err);
        throw err;
    }
};
