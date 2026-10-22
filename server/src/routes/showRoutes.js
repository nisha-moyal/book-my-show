import express from "express";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/role.js';
import {
    addShow,
    getShowByMovie,
    getShowByTheater,
    getShowById
} from "../controllers/showController.js";

import { bookShow, getMyBookings } from "../controllers/bookingController.js";

const router = express.Router();

// Owner(Partner): manage adding shows
router.post("/add", authMiddleware, allowRoles("owner"), addShow);

router.get("/get-by-movie", authMiddleware, getShowByMovie);

router.get("/get-by-theater", authMiddleware, allowRoles("admin", "owner"), getShowByTheater);

router.post('/book', authMiddleware, bookShow);
router.get('/my-bookings', authMiddleware, getMyBookings);


router.get("/:id", authMiddleware, getShowById);
// router.get("/get-by-theater", authMiddleware, allowRoles("admin", "owner"), getShowByTheater);

// router.post('/book', authMiddleware, bookShow);
// router.get('/my-bookings', authMiddleware, getMyBookings);

export default router;
