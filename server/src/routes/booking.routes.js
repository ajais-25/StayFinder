import express from "express";
import {
    createBooking,
    getUserBookings,
    getBookingById,
    updateBookingStatus,
    getHostBookings,
    deleteBooking,
} from "../controllers/booking.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All booking routes require authentication
router.use(authenticateUser);

// Guest booking routes
router.post("/", createBooking); // Create a new booking
router.get("/my-bookings", getUserBookings); // Get all bookings for the authenticated user
router.get("/:id", getBookingById); // Get a specific booking by ID
router.patch("/:id/status", updateBookingStatus); // Update booking status (cancel/confirm)
router.delete("/:id", deleteBooking); // Delete a booking

// Host booking routes
router.get("/host/bookings", getHostBookings); // Get all bookings for host's listings

export default router;
