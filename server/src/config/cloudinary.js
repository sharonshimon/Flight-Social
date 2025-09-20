import { v2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const cloudinary = v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/");
        return {
            folder: "travel_app",
            resource_type: isVideo ? "video" : "image",
            allowed_formats: isVideo
                ? ["mp4", "mov", "avi", "mkv"]
                : ["jpg", "jpeg", "png", "gif"],
            transformation: isVideo ? [] : [{ width: 800, crop: "limit" }],
        };
    },
});

const parser = multer({ storage });

export { cloudinary, parser }; 
