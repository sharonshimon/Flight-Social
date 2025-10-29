import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

// storgae data in env
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// data files
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/");
        const isImage = file.mimetype.startsWith("image/");
        const isAudio = file.mimetype.startsWith("audio/");

        const context = req.body.context || "general";

        let folder = `flight-social.app/${context}`;

        return {
            folder,
            resource_type: isVideo ? "video" : isAudio ? "auto" : "image",
            allowed_formats: isVideo
                ? ["mp4", "mov", "avi", "mkv"]
                : isAudio
                    ? ["mp3", "wav", "ogg"]
                    : ["jpg", "jpeg", "png", "gif", "webp"],
            transformation: isVideo
                ? []
                : [{ width: 1080, crop: "limit" }],
        };
    },
});

// parser of multer
const parser = multer({ storage });

export { cloudinary, parser };
