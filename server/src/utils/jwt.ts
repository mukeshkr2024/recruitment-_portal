require("dotenv").config();
import jwt from "jsonwebtoken";
import env from "../config/env"

export const generateToken = (id: string) => {
    return jwt.sign({ id }, env.JWT_KEY, { expiresIn: "24h" });
};
