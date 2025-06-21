import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.log("No file path provided to uploadOnCloudinary");
            return null;
        }

        // Check if file exists
        if (!fs.existsSync(localFilePath)) {
            console.log("File does not exist at path:", localFilePath);
            return null;
        }

        // upload file on cloudinary
        const res = await cloudinary.uploader.upload(localFilePath, {
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            resource_type: "auto", // Automatically detect resource type (image/video)
            folder: "StayFinder", // Optional: specify a folder in Cloudinary
        });

        // file uploaded successfully, remove the local temporary file
        try {
            fs.unlinkSync(localFilePath);
            console.log("Temporary file deleted:", localFilePath);
        } catch (unlinkError) {
            console.log(
                "Warning: Could not delete temporary file:",
                localFilePath,
                unlinkError.message
            );
        }

        return res;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        console.error("Error details:", {
            message: error.message,
            code: error.error?.code,
            httpCode: error.error?.http_code,
        });

        // Still try to clean up the temporary file
        try {
            if (localFilePath && fs.existsSync(localFilePath)) {
                fs.unlinkSync(localFilePath);
                console.log(
                    "Temporary file deleted after error:",
                    localFilePath
                );
            }
        } catch (unlinkError) {
            console.log(
                "Warning: Could not delete temporary file after error:",
                localFilePath,
                unlinkError.message
            );
        }

        return null;
    }
};

const deleteImageFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        // delete file from cloudinary
        const res = await cloudinary.api.delete_resources([`${publicId}`], {
            resource_type: "image",
            invalidate: true,
        });
        console.log(res);
        return res;
    } catch (error) {
        console.log(error);
        return null;
    }
};

const deleteVideoFromCloudinary = async (publicId) => {
    try {
        if (!publicId) return null;

        // delete file from cloudinary
        const res = await cloudinary.api.delete_resources([`${publicId}`], {
            resource_type: "video",
            invalidate: true,
        });
        return res;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export {
    uploadOnCloudinary,
    deleteImageFromCloudinary,
    deleteVideoFromCloudinary,
};
