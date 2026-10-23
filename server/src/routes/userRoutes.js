import { Router } from "express";
import {
  register,
  login,
  currentUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, currentUser);

router.patch("/forget-password", forgotPassword);

router.patch("/reset-password/:email", resetPassword);

export default router;
