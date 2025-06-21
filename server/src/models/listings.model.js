import mongoose, { Schema } from "mongoose";

const listingSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        pricePerNight: {
            type: Number,
            required: true,
        },
        images: [String], // URLs or Cloudinary image links
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);
