import { NextFunction, Request, Response } from "express";
import db from "../db";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";

export const getAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const job_positons = await db.query.position.findMany({
            columns: {
                id: true,
                positionName: true,
            }
        })
        const applicants = await db.query.applicant.findMany({

        })

        return res.status(200).json({
            job_positons,
            total_applicants: applicants?.length || 0
        })
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})