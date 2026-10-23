import User from "../models/user.js";
import { signToken } from "../utils/jwt.js";
import { EmailHelper } from "../utils/emailHelper.js";

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

const otpGenerator = () => {
    return Math.floor(100000 + Math.random() * 900000);
}

export const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = otpGenerator();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
        user.otp = otp;
        user.optExpiry = otpExpiry;
        
        await user.save();

        await EmailHelper("otp.html", email, { name: user.name, otp: otp });

        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
}

export const resetPassword = async(req, res) => {
    try {
        const { email } = req.params;

        const { newPassword, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(Date.now() > user.optExpiry) {
            return res.status(400).json({ message: "OTP expired" });
        }

        if(user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to reset password" });
    }
}

