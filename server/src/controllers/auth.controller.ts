import { Request, Response } from "express";
import db from "../db";
import { eq } from "drizzle-orm";
import { applicant, user } from "../db/schema";
import { generateToken } from "../utils/jwt";

export const applicantLogin = async (req: Request, res: Response) => {
    try {
        console.log("authenticating...");

        const { email, access_code } = req.body;

        if (!email || !access_code) {
            throw new Error("All fields are required")
        }

        const isUserFound = await db.query.applicant.findFirst({
            where: eq(user.email, email)
        })

        if (!isUserFound) {
            throw new Error("Invalid details")
        }

        const compareAccesCode = isUserFound.accessCode === access_code;

        if (!compareAccesCode) {
            throw new Error("Invalid details")
        }

        const access_token = generateToken(isUserFound.id)

        res.cookie("access_token", access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })

        return res.status(200).json({
            success: true,
            token: access_token,
        })

    } catch (error) {
        console.log(error);
    }
}

export const applicantDetail = async (req: Request, res: Response) => {
    try {

        const { id } = req

        if (!id) {
            throw new Error("Invalid ID")
        }

        const applicantFound = await db.query.applicant.findFirst({
            where: eq(applicant.id, id),
            columns: {
                firstName: true,
                lastName: true,
                email: true,
                phone: true
            }
        })

        res.status(200).json(applicantFound)
    } catch (error) {
        console.log(error);

    }
}