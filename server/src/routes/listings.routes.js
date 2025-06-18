import { Router } from "express";
import {
    getAllListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
} from "../controllers/listings.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllListings);
router.get("/:id", getListingById);
router.post("/", authenticateUser, upload.array("images", 10), createListing);
router.put("/:id", authenticateUser, upload.array("images", 10), updateListing);
router.delete("/:id", authenticateUser, deleteListing);

export default router;
