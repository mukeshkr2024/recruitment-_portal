import { NextFunction, Request, Response } from "express";
import db from "../db";
import { eq } from "drizzle-orm";
import { applicant, user } from "../db/schema";
import { generateToken } from "../utils/jwt";

// Error handling middleware
const handleError = (res: Response, message: string, statusCode: number = 400) => {
    return res.status(statusCode).json({ success: false, message });
};

export const applicantLogin = async (req: Request, res: Response) => {
    try {
        const { email, access_code } = req.body;

        if (!email || !access_code) {
            return handleError(res, "All fields are required", 400);
        }

        const isUserFound = await db.query.applicant.findFirst({
            where: eq(applicant.email, email) // fixed applicant schema usage
        });

        if (!isUserFound || isUserFound.accessCode !== access_code) {
            return handleError(res, "Invalid details", 401);
        }

        const access_token = generateToken(isUserFound.id);

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            token: access_token,
        });

    } catch (error) {
        console.error("Error during applicant login:", error);
        return handleError(res, "Server error", 500);
    }
};

export const applicantDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req;

        if (!id) {
            return handleError(res, "Invalid ID", 400);
        }

        const applicantFound = await db.query.applicant.findFirst({
            where: eq(applicant.id, id),
            columns: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
            }
        });

        if (!applicantFound) {
            return handleError(res, "Applicant not found", 404);
        }

        res.status(200).json(applicantFound);
    } catch (error) {
        console.error("Error fetching applicant details:", error);
        return handleError(res, "Server error", 500);
    }
};

export const userLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handleError(res, "All fields are required", 400);
        }

        const isUserFound = await db.query.user.findFirst({
            where: eq(user.email, email)
        });

        if (!isUserFound || isUserFound.password !== password) {
            return handleError(res, "Invalid details", 401);
        }

        const access_token = generateToken(isUserFound.id);

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            token: access_token,
        });

    } catch (error) {
        console.error("Error during user login:", error);
        return handleError(res, "Server error", 500);
    }
};

export const userDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req;

        if (!id) {
            return handleError(res, "Invalid ID", 400);
        }

        const userFound = await db.query.user.findFirst({
            where: eq(user.id, id),
            columns: {
                id: false,
                password: false,
                createdAt: false,
                updatedAt: false // corrected typo
            }
        });

        if (!userFound) {
            return handleError(res, "User not found", 404);
        }

        res.status(200).json(userFound);
    } catch (error) {
        console.error("Error fetching user details:", error);
        return handleError(res, "Server error", 500);
    }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Error during logout:", error);
        return handleError(res, "Server error", 500);
    }
};
