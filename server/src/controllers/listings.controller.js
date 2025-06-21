import { Listing } from "../models/listings.model.js";
import { Booking } from "../models/booking.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Get all listings
const getAllListings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            location,
            minPrice,
            maxPrice,
        } = req.query;

        // Build filter object
        const filter = {};

        if (location) {
            filter.location = { $regex: location, $options: "i" }; // Case-insensitive search
        }

        if (minPrice || maxPrice) {
            filter.pricePerNight = {};
            if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
            if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
        }

        const skip = (page - 1) * limit;

        const listings = await Listing.find({
            ...filter,
            host: { $ne: req.user?._id },
        })
            .populate("host", "name email")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 });

        const totalListings = listings.length;
        const totalPages = Math.ceil(totalListings / limit);

        res.status(200).json({
            success: true,
            message: "Listings fetched successfully",
            data: {
                listings,
                pagination: {
                    currentPage: Number(page),
                    totalPages,
                    totalListings,
                    hasNextPage: page < totalPages,
                    hasPrevPage: page > 1,
                },
            },
        });
    } catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getHostListings = async (req, res) => {
    try {
        const userId = req.user._id;

        const listings = await Listing.find({ host: userId })
            .populate("host", "name email phoneNumber")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Host listings fetched successfully",
            data: listings,
        });
    } catch (error) {
        console.error("Error fetching host listings:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get listing by ID
const getListingById = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id).populate(
            "host",
            "name email phoneNumber"
        );

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        // Fetch all confirmed bookings for this listing
        const bookings = await Booking.find({
            listing: id,
            status: "confirmed",
        }).select("checkIn checkOut");

        // Generate array of unavailable dates
        const unavailableDates = [];

        bookings.forEach((booking) => {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);

            // Add all dates from checkIn to checkOut (inclusive)
            for (
                let date = new Date(checkIn);
                date <= checkOut;
                date.setDate(date.getDate() + 1)
            ) {
                unavailableDates.push(
                    new Date(date).toISOString().split("T")[0]
                ); // Format as YYYY-MM-DD
            }
        });

        // Remove duplicates and sort
        const uniqueUnavailableDates = [...new Set(unavailableDates)].sort();

        res.status(200).json({
            success: true,
            message: "Listing fetched successfully",
            data: {
                ...listing.toObject(),
                unavailableDates: uniqueUnavailableDates,
            },
        });
    } catch (error) {
        console.error("Error fetching listing:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Create a new listing
const createListing = async (req, res) => {
    try {
        const { title, description, location, pricePerNight } = req.body;
        const host = req.user._id; // Assuming user is attached to req from auth middleware

        if (!title || !description || !location || !pricePerNight) {
            return res.status(400).json({
                success: false,
                message:
                    "Title, description, location, and price per night are required",
            });
        }

        // Handle image uploads
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    imageUrls.push(uploadResult.secure_url);
                }
            }
        }

        const listing = await Listing.create({
            title,
            description,
            location,
            pricePerNight: Number(pricePerNight),
            images: imageUrls,
            host,
        });

        const populatedListing = await Listing.findById(listing._id).populate(
            "host",
            "name email"
        );

        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            data: populatedListing,
        });
    } catch (error) {
        console.error("Error creating listing:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Update a listing
const updateListing = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, location, pricePerNight } = req.body;
        const userId = req.user._id;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        // Check if user is the host of this listing
        if (listing.host.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this listing",
            });
        }

        // Handle new image uploads
        const newImageUrls = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const uploadResult = await uploadOnCloudinary(file.path);
                if (uploadResult) {
                    newImageUrls.push(uploadResult.secure_url);
                }
            }
        }

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (location) updateData.location = location;
        if (pricePerNight) updateData.pricePerNight = Number(pricePerNight);
        if (newImageUrls.length > 0) {
            updateData.images = [...listing.images, ...newImageUrls];
        }

        const updatedListing = await Listing.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true,
        }).populate("host", "name email");

        res.status(200).json({
            success: true,
            message: "Listing updated successfully",
            data: updatedListing,
        });
    } catch (error) {
        console.error("Error updating listing:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Delete a listing
const deleteListing = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        } // Check if user is the host of this listing
        if (listing.host.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this listing",
            });
        }

        // Cancel all bookings associated with this listing
        await Booking.updateMany(
            {
                listing: id,
                status: { $ne: "cancelled" }, // Only update non-cancelled bookings
            },
            {
                status: "cancelled",
            }
        );

        await Listing.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Listing and associated bookings deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting listing:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

export {
    getAllListings,
    getHostListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
};
