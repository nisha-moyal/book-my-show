// Allows the request only if the logged-in user's role is in the list
export const allowRoles = (...roles) => (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
        return res.status(403).json({ message: "Access denied" });
    }
    next();
};
