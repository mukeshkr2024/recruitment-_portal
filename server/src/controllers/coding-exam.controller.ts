import e, { application, NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import db from "../db";
import { applicant, codingQuestion, exam, examSubmission, question, submission } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const getCodingQuestions = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { examId, assessmentId } = req.params;

            const applicantId = req.id;

            console.log(examId, assessmentId);

            const examSubmissionData = await db.query.examSubmission.findFirst({
                where: and(eq(examSubmission.examId, examId), eq(examSubmission.assessmentId, assessmentId))
            })

            if (!examSubmissionData) {
                await db.insert(examSubmission).values({
                    applicantId: applicantId!,
                    assessmentId: assessmentId,
                    examId: examId,
                    status: 'INPROGRESS'
                }).returning()
            }

            await db.update(applicant).set({
                status: "INPROGRESS"
            }).where(
                eq(applicant.id, applicantId!)
            )

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

            const response = {
                exam: examFound[0],
                status: examSubmissionData ? examSubmissionData.status : 'INPROGRESS'
            };

            return res.status(200).json(response)

        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    }
)

export const saveCodingAnswer = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { answer, codingQuestionId } = req.body;

            const { examId, assessmentId } = req.params;

            const applicantId = req.id

            if (!applicantId) {
                return next(new ErrorHandler("Unauthorized", 401));
            }

            if (!answer || !codingQuestionId) {
                return next(new ErrorHandler("Invalid request", 400));
            }


            const examSubmissionData = await db.query.examSubmission.findFirst({
                where: and(eq(examSubmission.examId, examId), eq(examSubmission.assessmentId, assessmentId))
            })

            if (!examSubmissionData) {
                return next(new ErrorHandler("No submission found ", 404));
            }


            // if (!examSubmissionData) { // TODO: create during iniiial loads
            //     examSubmissionData = await db.insert(examSubmission).values({
            //         applicantId: applicantId,
            //         assessmentId: assessmentId,
            //         examId: examId,
            //         status: 'INPROGRESS'
            //     }).returning()

            //     console.log("created submission", examSubmissionData);
            // }


            let submissionData;

            submissionData = await db.query.submission.findFirst({
                where: and(eq(submission.examId, examId), eq(submission.codingQuestionId, codingQuestionId), eq(submission.applicantId, applicantId))
            })

            console.log("submissionData found", submissionData);

            if (!submissionData) {

                const questionFound = await db.query.question.findFirst({
                    where: eq(question.id, codingQuestionId)
                })

                console.log("question found", questionFound);


                submissionData = await db.insert(submission).values({
                    examId: examId,
                    applicantId: applicantId,
                    codingQuestionId: codingQuestionId,
                    submittedAnswer: answer,
                    submissionId: examSubmissionData.id,
                })

                console.log("submissionData CREATED", submissionData);

            } else {
                submissionData = await db.update(submission).set({
                    submittedAnswer: answer
                }).where(
                    and(eq(submission.examId, examId), eq(submission.codingQuestionId, codingQuestionId), eq(submission.applicantId, applicantId))
                ).returning()

                console.log("submission updated", submissionData);

            }


            // if (!submissionData) {

            //     submissionData = await db.insert(submission).values({
            //         applicantId: applicantId,
            //         questionId: questionId,
            //         examId: examId,
            //         submittedAnswer: answer
            //     }).returning()

            //     console.log("submission created", submissionData);
            // } else {
            //     submissionData = await db.update(submission).set({
            //         submittedAnswer: answer
            //     }).where(
            //         and(eq(submission.examId, examId), eq(submission.questionId, questionId), eq(submission.applicantId, applicantId))
            //     ).returning()

            //     console.log("submission updated", submissionData);

            // }


            return res.status(200).json({
                message: "Saved successfully"
            })


        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    }
)


export const submitCodingExam = CatchAsyncError(async (
    req: Request, res: Response, next: NextFunction
) => {
    try {
        const { examId, assessmentId } = req.params;

        const applicantId = req.id;

        if (!applicantId) {
            return next(new ErrorHandler("Unauthorized", 401));
        }

        const examSubmissionData = await db.query.examSubmission.findFirst({
            where: and(eq(examSubmission.examId, examId), eq(examSubmission.assessmentId, assessmentId), eq(examSubmission.applicantId, applicantId))
        })

        console.log("submission data: " + examSubmissionData);

        if (!examSubmissionData) {
            return next(new ErrorHandler("Something went wrong", 404));
        }

        await db.update(examSubmission).set({
            status: "COMPLETED"
        }).where(
            and(eq(examSubmission.examId, examId), eq(examSubmission.assessmentId, assessmentId))
        )

        return res.status(200).json({
            message: "Exam submitted successfully"
        })

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const getSavedAnswer = CatchAsyncError(
    async (
        req: Request, res: Response, next: NextFunction
    ) => {
        try {
            const { examId, assessmentId, questionId } = req.params;

            const applicantId = req.id!;

            const questionFound = await db.query.codingQuestion.findFirst({
                where: eq(codingQuestion.id, questionId)
            })

            console.log("Question found", questionFound);

            const answerFound = await db.query.submission.findFirst({
                where: and(eq(submission.examId, examId), eq(submission.codingQuestionId, questionId), eq(submission.applicantId, applicantId))
            })

            console.log("Answer found", answerFound);


            return res.status(200).json({
                code: answerFound?.submittedAnswer || null
            })
        } catch (error) {
            return next(new ErrorHandler(error, 400));
        }
    }
)