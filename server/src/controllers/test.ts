import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import db from "../db";
import { ErrorHandler } from "../utils/ErrorHandler";

export const giveData = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Fetching data from all models
            const applicants = await db.query.applicant.findMany();
            const assessments = await db.query.assessment.findMany();
            const examResults = await db.query.examResult.findMany();
            const exams = await db.query.exam.findMany();
            const positions = await db.query.position.findMany();
            const options = await db.query.option.findMany();
            const jobPositionExams = await db.query.jobPositionExams.findMany();
            const questions = await db.query.question.findMany();
            const users = await db.query.user.findMany();

            // Sending the fetched data as a JSON response
            return res.status(200).json({
                applicants,
                assessments,
                examResults,
                exams,
                positions,
                options,
                jobPositionExams,
                questions,
                users,
            });
        } catch (error) {
            next(new ErrorHandler(error, 500)); // Handling any errors
        }
    }
);
