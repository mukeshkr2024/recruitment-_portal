import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import env from "../config/env";
import db from "../db";
import { eq } from "drizzle-orm";
import { applicant } from "../db/schema";

export const isApplicantAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.access_token;

        if (!access_token) {
            return res.status(401).json({ message: "Access Denied" });
        }

        const decoded = jwt.verify(access_token, env.JWT_KEY) as JwtPayload;

        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: "Access Token Expired" });
        }

        const applicantFound = await db.query.applicant.findFirst({
            where: eq(applicant.id, decoded.id),
        });

        if (!applicantFound) {
            return res.status(404).json({ message: "Applicant Not Found" });
        }

        req.id = applicantFound.id;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const isAdminAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const access_token = req.cookies.access_token;

        if (!access_token) {
            return res.status(401).json({ message: "Access Denied" });
        }

        const decoded = jwt.verify(access_token, env.JWT_KEY) as JwtPayload;

        if (!decoded || !decoded.id) {
            return res.status(403).json({ message: "Access Token Expired" });
        }

        const userFound = await db.query.user.findFirst({
            where: eq(applicant.id, decoded.id),
        });

        if (!userFound) {
            return res.status(404).json({ message: "User Not Found" });
        }

        req.id = userFound.id;
        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};