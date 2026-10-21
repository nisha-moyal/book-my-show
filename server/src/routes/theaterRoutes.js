import express from "express";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/role.js';
import {
    getTheaters,
    getMyTheaters,
    getPendingTheaters,
    getTheaterById,
    addTheater,
    updateTheater,
    deleteTheater,
    approveTheater,
    rejectTheater
} from "../controllers/theaterController.js";

const router = express.Router();

// Specific paths come before "/:id" so they aren't treated as ids
router.get("/mine", authMiddleware, allowRoles("owner"), getMyTheaters);
router.get("/pending", authMiddleware, allowRoles("admin"), getPendingTheaters);

// Admin: view all theaters
router.get("/", authMiddleware, allowRoles("admin"), getTheaters);

// Owner: manage own theaters
router.post("/", authMiddleware, allowRoles("owner"), addTheater);
router.put("/:id", authMiddleware, allowRoles("owner"), updateTheater);
router.delete("/:id", authMiddleware, allowRoles("owner"), deleteTheater);

// Admin: approve or reject
router.patch("/:id/approve", authMiddleware, allowRoles("admin"), approveTheater);
router.patch("/:id/reject", authMiddleware, allowRoles("admin"), rejectTheater);

// Single theater: admin or owner (the controller should also check ownership for owners)
router.get("/:id", authMiddleware, allowRoles("admin", "owner"), getTheaterById);

export default router;

