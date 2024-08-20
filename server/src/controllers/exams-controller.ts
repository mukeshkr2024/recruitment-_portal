import { Request, Response } from "express";
import db from "../db";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { eq } from "drizzle-orm";
import { exam } from "../db/schema";

export const getExams = CatchAsyncError(async (req: Request, res: Response) => {
    try {

        const exams = await db.query.exam.findMany({})

        return res.status(200).json({ exams })
    } catch (error) {
        console.log(error);
    }
})


export const getExamQuestions = CatchAsyncError(async (req: Request, res: Response) => {
    try {

        const { examId } = req.params;

        const query = await db.query.exam.findFirst({
            where: eq(exam.id, examId),
            with: {
                questions: true
            }
        })

        console.log(examId);

        return res.status(200).json(query)
    } catch (error) {
        console.log(error);
    }
})