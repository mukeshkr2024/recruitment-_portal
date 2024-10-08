import e, { application, NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import db from "../db";
import { applicant, assessment, exam, examSubmission, question, submission } from "../db/schema";
import { and, eq } from "drizzle-orm";

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

export const saveCodingAnswer = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log(req.body);
            const { answer, codingQuestionId } = req.body;

            const { examId, assessmentId } = req.params;

            const applicantId = req.id

            if (!applicantId) {
                return next(new ErrorHandler("Unauthorized", 401));
            }

            if (!answer || !codingQuestionId) {
                return next(new ErrorHandler("Invalid request", 400));
            }

            let examSubmissionData

            examSubmissionData = await db.query.examSubmission.findFirst({
                where: and(eq(examSubmission.examId, examId), eq(examSubmission.assessmentId, assessmentId))
            })

            console.log('submission found', examSubmissionData);


            if (!examSubmissionData) {
                examSubmissionData = await db.insert(examSubmission).values({
                    applicantId: applicantId,
                    assessmentId: assessmentId,
                    examId: examId,
                    status: 'INPROGRESS'
                })

                console.log("created submission", examSubmissionData);
            }


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