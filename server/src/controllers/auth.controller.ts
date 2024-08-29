import { NextFunction, Request, Response } from "express";
import db from "../db";
import { eq } from "drizzle-orm";
import { applicant, user } from "../db/schema";
import { generateToken } from "../utils/jwt";
import { ErrorHandler } from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";


export const applicantLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, access_code } = req.body;

        if (!email || !access_code) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }

        const isUserFound = await db.query.applicant.findFirst({
            where: eq(applicant.email, email)
        });

        if (!isUserFound || isUserFound.accessCode !== access_code) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }

        const access_token = generateToken(isUserFound.id);
        res.cookie("access_token", access_token, {
            // httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            token: access_token,
        });

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
};

export const applicantDetail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req;

        if (!id) {
            throw new Error("Invalid id")
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
            throw new Error("applicant not found")
        }

        res.status(200).json(applicantFound);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

export const userLogin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }

        const isUserFound = await db.query.user.findFirst({
            where: eq(user.email, email)
        });

        if (!isUserFound || isUserFound.password !== password) {
            return next(new ErrorHandler("Invalid credentials", 400))
        }

        const access_token = generateToken(isUserFound.id);

        res.cookie("access_token", access_token, {
            // httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            token: access_token,
        });

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

export const userDetail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req;

        if (!id) {
            throw new Error("Invalid id")
        }

        const userFound = await db.query.user.findFirst({
            where: eq(user.id, id),
            columns: {
                id: false,
                password: false,
                createdAt: false,
                updatedAt: false
            }
        });

        if (!userFound) {
            throw new Error("User not found")
        }

        res.status(200).json(userFound);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

export const logout = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
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
        return next(new ErrorHandler(error, 400));
    }
});
