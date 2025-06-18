import express from "express";
import userRoutes from "./user.routes.js";
import listingsRoutes from "./listings.routes.js";

const router = express.Router();

// Mount user routes
router.use("/auth", userRoutes);

// Mount listings routes
router.use("/listings", listingsRoutes);

// Health check route
router.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running successfully",
        timestamp: new Date().toISOString(),
    });
});

export default router;
