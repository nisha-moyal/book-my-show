import jwt from "jsonwebtoken";

export function signToken(payload) {
    const secret = process.env.JWT_SECRET || "testSecret";

    return jwt.sign(payload, secret, { expiresIn: "1d" });
}