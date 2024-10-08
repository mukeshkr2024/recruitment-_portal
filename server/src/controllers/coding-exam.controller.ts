import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import db from "../db";
import { applicant, exam } from "../db/schema";
import { eq } from "drizzle-orm";

export const getCodingQuestions = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { examId, assessmentId } = req.params;

            console.log(examId, assessmentId);

            // TODO: add later 
            // const applicantId = req.id; 

            // await db.update(applicant).set({
            //     status: "INPROGRESS"
            // }).where(
            //     eq(applicant.id, applicantId!)
            // )

            const examFound = await db.query.exam.findMany({
                where: eq(exam.id, examId),
                with: {
                    codingQuestions: {
                        columns: {
                            id: true,
                            questionText: true,
                            questionCode: true,
                            haveQuestionCode: true,
                            language: true,
                        }
                    }
                }
            })


            console.log("called");

            return res.status(200).json(examFound[0])

        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    }
)