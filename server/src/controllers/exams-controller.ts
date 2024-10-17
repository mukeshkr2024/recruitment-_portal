import e, { NextFunction, raw, Request, Response } from "express";
import db from "../db";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { and, count, eq, sql } from "drizzle-orm";
import { codingQuestion, exam, examResult, jobPositionExams, position, question } from "../db/schema";
import { ErrorHandler } from "../utils/ErrorHandler";
import path from "path"
import { Document, Packer, Paragraph, TextRun } from "docx"
import fs from "fs"


export const getExams = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const examsWithQuestionCount = await db
            .select({
                id: exam.id,
                name: exam.name,
                createdAt: exam.createdAt,
                duration: exam.duration,
                totalQuestions: count(question.id),
                codingQuestions: count(codingQuestion.id),
                examType: exam.examType
            })
            .from(exam)
            .leftJoin(question, sql`${exam.id} = ${question.examId}`)
            .leftJoin(codingQuestion, sql`${exam.id} = ${codingQuestion.examId}`)
            .groupBy(exam.id, exam.name)
            .orderBy(exam.name);
        return res.status(200).json({ exams: examsWithQuestionCount });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})


export const getExamQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { examId } = req.params;

        const query = await db.query.exam.findFirst({
            where: eq(exam.id, examId),
            with: {
                questions: true,
                codingQuestions: true
            }
        })


        return res.status(200).json(query)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const createExam = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { name, examType } = req.body;

        if (!name) {
            throw new Error("Name is required");
        }

        const newExam = await db.insert(exam).values({
            name,
            examType
        }).returning()

        return res.status(201).json(newExam)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const updateExamDuration = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId } = req.params;

        const { duration } = req.body;

        const updatedExam = await db.update(exam).set({
            duration: duration
        }).where(eq(exam.id, examId)).returning()


        if (!updatedExam) {
            throw new Error("Exam not found")
        }

        return res.status(200).json(updatedExam);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const getPositionExams = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { positionId } = req.params;

        const query = await db.query.jobPositionExams.findMany({
            where: eq(jobPositionExams.positionId, positionId),
            with: {
                exam: true
            }
        })
        if (!query) {
            throw new Error("No exams found for this position")
        }

        return res.status(200).json(query)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})


export const updatePostionExam = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { examId, positionId } = req.params;

        const { isActive } = req.body


        const updatePositionExam = await db.update(jobPositionExams).set({
            isActive: isActive
        }).where(and(eq(jobPositionExams.examId, examId), eq(jobPositionExams.positionId, positionId))).returning();

        if (!updatePositionExam) {
            throw new Error("Position exam not found")
        }

        return res.status(200).json(updatePositionExam)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const deletePositionExam = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId, positionId } = req.params;

        const deletedPostion = await db.delete(jobPositionExams).where(and(eq(jobPositionExams.examId, examId), eq(jobPositionExams.positionId, positionId))).returning()

        if (!deletedPostion) {
            throw new Error("Position exam not found")
        }

        return res.status(204).json(deletePositionExam)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const createPositionExam = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId, positionId } = req.params;

        console.log("callled position");



        const examFound = await db.query.exam.findFirst({
            where: eq(exam.id, examId)
        })

        if (!examFound) {
            throw new Error("Exam not found")
        }

        const positionFound = await db.query.position.findFirst({
            where: eq(position.id, positionId)
        })

        if (!positionFound) {
            throw new Error("Position not found")
        }

        // check if position exam exists already
        const isPositionExamExists = await db.query.jobPositionExams.findFirst({
            where: and(eq(jobPositionExams.positionId, positionId), eq(jobPositionExams.examId, examId))
        })

        if (isPositionExamExists) {
            throw new Error("This exam already exists")
        }

        const newPositionExam = await db.insert(jobPositionExams).values({
            examId,
            positionId,
            isActive: true
        }).returning()


        return res.status(201).json(newPositionExam);

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})


export const deleteExam = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { examId } = req.params;

        const deleteExam = await db.delete(exam).where(
            eq(exam.id, examId)
        )

        if (!deleteExam) {
            throw new Error("Exam not found")
        }

        return res.status(200).json({
            success: true,
        })

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const updateExamResultStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { examId } = req.params;
        const { status } = req.body;

        if (!status) {
            throw new Error("Status is required")
        }

        const data = await db.update(examResult).set({
            examStatus: status
        }).where(eq(examResult.id, examId))

        if (!data) {
            throw new Error("Exam not found")
        }

        return res.status(200).json({
            message: "Status updated successfully"
        })

    } catch (error) {
        return next(new ErrorHandler(error, 400));

    }
})


export const getFileAndCreateQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {

});

