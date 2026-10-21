import User from "../models/user.js";
import { signToken } from "../utils/jwt.js";

export const register = async(req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = new User({ name, email, password });

    try {
        await await User.create(user);
        return res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to register user" });
    }
}

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await user.matchPassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = signToken({userId: user._id.toString(), role: user.role});
        const userDetails = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        return res.status(200).json({ 
            success: true, 
            message: "Login successful", 
            data: {
                token,
                user: userDetails
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Login failed" });
    }
}

export const currentUser = async(req, res) => {
    console.log(req.userId, "req.userId");
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ 
            success: true, 
            message: "User fetched successfully",
            data: {
                user
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Login failed" });
    }
}