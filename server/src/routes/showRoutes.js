import express from "express";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { allowRoles } from '../middleware/role.js';
import {
    addShow,
    getShowByMovie,
    getShowByTheater
} from "../controllers/showController.js";

const router = express.Router();


// Owner(Partner): manage adding shows
router.post("/add", authMiddleware, allowRoles("owner"), addShow);

router.get("/get-by-movie", authMiddleware, getShowByMovie);
router.get("/get-by-theater", authMiddleware, allowRoles("admin", "owner"), getShowByTheater);

export default router;

