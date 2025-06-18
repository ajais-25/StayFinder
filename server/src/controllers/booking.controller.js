import mongoose from "mongoose";
import { Booking } from "../models/booking.model.js";
import { Listing } from "../models/listings.model.js";

// Create a new booking
const createBooking = async (req, res) => {
    const { listing, checkIn, checkOut, totalPrice } = req.body;
    const guest = req.user._id;

    if (!listing || !checkIn || !checkOut || !totalPrice) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        // Validate that the listing exists
        const existingListing = await Listing.findById(listing);
        if (!existingListing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found",
            });
        }

        // Validate check-in and check-out dates
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const currentDate = new Date();

        if (checkInDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: "Check-in date cannot be in the past",
            });
        }

        if (checkOutDate <= checkInDate) {
            return res.status(400).json({
                success: false,
                message: "Check-out date must be after check-in date",
            });
        }

        // Check for conflicting bookings
        const conflictingBooking = await Booking.findOne({
            listing,
            status: "confirmed",
            $or: [
                {
                    checkIn: { $lte: checkInDate },
                    checkOut: { $gt: checkInDate },
                },
                {
                    checkIn: { $lt: checkOutDate },
                    checkOut: { $gte: checkOutDate },
                },
                {
                    checkIn: { $gte: checkInDate },
                    checkOut: { $lte: checkOutDate },
                },
            ],
        });

        if (conflictingBooking) {
            return res.status(400).json({
                success: false,
                message: "The listing is not available for the selected dates",
            });
        }

        const newBooking = await Booking.create({
            guest,
            listing,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalPrice,
        });

        const populatedBooking = await Booking.findById(newBooking._id)
            .populate("guest", "name email phoneNumber")
            .populate("listing", "title location pricePerNight");

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: populatedBooking,
        });
    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get all bookings for the authenticated user
const getUserBookings = async (req, res) => {
    const userId = req.user._id;

    try {
        const bookings = await Booking.find({ guest: userId })
            .populate("listing", "title location pricePerNight images")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
            data: bookings,
        });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get a specific booking by ID
const getBookingById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const booking = await Booking.findOne({ _id: id, guest: userId })
            .populate("guest", "name email phoneNumber address")
            .populate(
                "listing",
                "title description location pricePerNight images owner"
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Booking retrieved successfully",
            data: booking,
        });
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Update booking status (cancel booking)
const updateBookingStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user._id;

    if (!status || !["confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({
            success: false,
            message: "Valid status is required (confirmed or cancelled)",
        });
    }

    try {
        const booking = await Booking.findOne({ _id: id, guest: userId });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Check if booking can be cancelled (e.g., not already started)
        if (status === "cancelled" && new Date() > booking.checkIn) {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel a booking that has already started",
            });
        }

        booking.status = status;
        await booking.save();

        const updatedBooking = await Booking.findById(booking._id)
            .populate("guest", "name email phoneNumber")
            .populate("listing", "title location pricePerNight");

        res.status(200).json({
            success: true,
            message: `Booking ${status} successfully`,
            data: updatedBooking,
        });
    } catch (error) {
        console.error("Error updating booking status:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Get bookings for host's listings
const getHostBookings = async (req, res) => {
    const hostId = req.user._id;

    try {
        // Find all listings owned by the host
        const hostListings = await Listing.find({
            host: hostId,
        }).select("_id");

        const listingIds = hostListings.map((listing) => listing._id);

        // Find all bookings for these listings
        const bookings = await Booking.find({ listing: { $in: listingIds } })
            .populate("guest", "name email phoneNumber")
            .populate("listing", "title location pricePerNight")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Host bookings retrieved successfully",
            data: bookings,
        });
    } catch (error) {
        console.error("Error fetching host bookings:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Delete a booking (only if not confirmed or before check-in)
const deleteBooking = async (req, res) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const booking = await Booking.findOne({ _id: id, guest: userId });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Only allow deletion if booking is cancelled or before check-in date
        if (booking.status === "confirmed" && new Date() >= booking.checkIn) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete a confirmed booking that has started",
            });
        }

        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Booking deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting booking:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getHostBookings,
    deleteBooking,
};
