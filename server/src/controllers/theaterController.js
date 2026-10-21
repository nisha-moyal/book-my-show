import Theater from "../models/theater.js";

export const getTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find();
        res.status(200).json(theaters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({ owner: req.userId });
        res.status(200).json(theaters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getTheaterById = async (req, res) => {
    try {
        const theater = await Theater.findById(req.params.id);
        res.status(200).json(theater);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const addTheater = async (req, res) => {
    try {
        // Check if the theater already exists
        const existingTheater = await Theater.findOne({ name: req.body.name });
        if (existingTheater) {
            return res.status(400).json({ message: "Theater already exists" });
        }

        const theater = await Theater.create({...req.body, owner: req.userId});
        res.status(201).json(theater);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateTheater = async (req, res) => {
    try {
        // Check if the theater exists
        const theater = await Theater.findById(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        // Only the owner can update
        if (theater.owner.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only update your own theaters" });
        }

        const updatedTheater = await Theater.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedTheater);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteTheater = async (req, res) => {
    try {
        // Check if the theater exists
        const theater = await Theater.findById(req.params.id);
        if (!theater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        // Only the owner can delete
        if (theater.owner.toString() !== req.userId) {
            return res.status(403).json({ message: "You can only delete your own theaters" });
        }

        await Theater.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Theater deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getPendingTheaters = async (req, res) => {
    try {
        const theaters = await Theater.find({ approvalStatus: "pending" })
            .populate("owner", "name email");
        res.status(200).json(theaters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const approveTheater = async (req, res) => {
    try {
        const updatedTheater = await Theater.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: "approved", isActive: true },
            { new: true }
        );

        if (!updatedTheater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        res.status(200).json(updatedTheater);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const rejectTheater = async (req, res) => {
    try {
        const updatedTheater = await Theater.findByIdAndUpdate(
            req.params.id,
            { approvalStatus: "rejected", isActive: false },
            { new: true }
        );

        if (!updatedTheater) {
            return res.status(404).json({ message: "Theater not found" });
        }

        res.status(200).json(updatedTheater);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
