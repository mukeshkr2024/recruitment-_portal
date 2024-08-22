import { NextFunction, Request, Response } from "express";
import db from "../db";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";

export const getAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const jobPositions = await db.query.position.findMany({
            columns: {
                id: true,
                positionName: true,
            }
        });

        const applicants = await db.query.applicant.findMany({});

        return res.status(200).json({
            jobPositions,
            totalApplicants: applicants.length
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});
