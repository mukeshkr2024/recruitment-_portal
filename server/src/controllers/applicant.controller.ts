import { and, asc, desc, eq } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import db from "../db";
import { applicant, assementRelations, assessment, jobPositionExams, option, question, } from "../db/schema";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateAccessCode } from "../utils";
import { ErrorHandler } from "../utils/ErrorHandler";

export const getApplicantsAssessmentQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assessmentId } = req.params;

        const assessmentFound = await db.query.assessment.findFirst({
            where: eq(assessment.id, assessmentId)
        });

        if (!assessmentFound) {
            return next(new ErrorHandler("Assessment not found", 404));
        }

        const jobExams = await db.query.jobPositionExams.findMany({
            where: and(eq(jobPositionExams.positionId, assessmentFound.positionId), eq(jobPositionExams.isActive, true)),
            with: {
                exam: {
                    with: {
                        questions: {
                            with: {
                                options: {
                                    columns: {
                                        id: true,
                                        optionText: true
                                    }
                                },

                            },
                            columns: {
                                id: true,
                                questionText: true
                            }
                        }
                    }
                }
            }
        });

        let totalTime = 0;
        let questions: any[] = [];

        for (const jobExam of jobExams) {
            if (jobExam.exam) {
                totalTime += jobExam.exam.duration || 0;
                if (jobExam.exam.questions) {
                    questions = questions.concat(jobExam.exam.questions);
                }
            }
        }

        return res.status(200).json({
            questions,
            total_time: totalTime
        });

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

export const submitAssessment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const answers = req.body;
        const { assementId } = req.params;

        console.log(assementId);


        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'Invalid input: answers should be a non-empty array.' });
        }

        let totalScore = 0;

        const maxScore = answers.length;

        for (let answer of answers) {
            const correctOption = await db.query.option.findFirst({
                where: and(
                    eq(option.questionId, answer.questionId),
                    eq(option.isCorrect, true)
                )
            });

            if (!correctOption) {
                continue;
            }


            if (correctOption.id === answer.selectedOptionId) {
                totalScore += 1;
            }
        }

        await db.update(assessment).set({
            score: totalScore,
            totalScore: maxScore,
            status: "COMPLETED"
        }).where(eq(assessment.id, assementId))

        return res.status(200).json({ success: "true" });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});


export const getApplicants = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const assesment = await db.query.assessment.findMany({
            with: {
                applicant: true,
                position: true,
            },
            orderBy: desc(assessment.createdAt)
        })

        return res.status(200).json(assesment)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});

export const getApplicantsByPositon = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("getApplicantsByPositon");

        const { positionId } = req.params

        const applicants = await db.query.assessment.findMany({
            where: eq(assessment.positionId, positionId),
            with: {
                applicant: true,
                position: true,
            }
        })

        console.log(applicants);

        return res.status(200).json(applicants)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const getApplicantAssesment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const applicantId = req.id;

        if (!applicantId) return

        const assessments = await db.query.assessment.findMany({
            where: eq(assessment.applicantId, applicantId),
            columns: {
                id: true,
                status: true
            },
            with: {
                position: {
                    columns: {
                        positionName: true,
                        createdAt: true
                    }
                },
            },
            orderBy: asc(assessment.createdAt)
        })

        return res.status(200).json(assessments)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})


export const registerApplicant = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, phone, appliedFor } = req.body

        if (!firstName || !lastName || !email || !phone || !appliedFor) {
            throw new Error("All fields are required")
        }


        const existingApplicant = await db.query.applicant.findFirst({
            where: eq(applicant.email, email)
        })

        console.log(existingApplicant);

        let foundApplicant;

        if (existingApplicant) {
            foundApplicant = await db.update(applicant).set({
                accessCode: generateAccessCode(8)
            }).where(eq(applicant.email, existingApplicant.email)).returning()

        } else {
            foundApplicant = await db.insert(applicant).values({
                firstName,
                lastName,
                email,
                phone,
                accessCode: generateAccessCode(8)
            }).returning()

        }

        console.log(foundApplicant);

        const assesment = await db.insert(assessment).values({
            applicantId: foundApplicant[0].id,
            positionId: appliedFor
        }).returning()

        console.log(assesment);


        return res.status(201).json({
            success: true,
        })

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})


export const getJobPostions = CatchAsyncError(async (Req: Request, res: Response, next: NextFunction) => {
    try {
        const jobPositions = await db.query.position.findMany({
            columns: {
                id: true,
                positionName: true
            }
        })

        return res.status(200).json(jobPositions)

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})


export const getInstructionsDetails = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { assessmentId } = req.params;

        const assessmentFound = await db.query.assessment.findFirst({
            where: eq(assessment.id, assessmentId),
            with: {
                position: true
            }
        });

        if (!assessmentFound) {
            return next(new ErrorHandler("Assessment not found", 404));
        }

        const JobExams = await db.query.jobPositionExams.findMany({
            where: and(eq(jobPositionExams.positionId, assessmentFound.positionId), eq(jobPositionExams.isActive, true)),
            with: {
                exam: {
                    with: { questions: true }
                }
            }
        });

        let total_time = 0;
        let total_questions = 0;

        for (const exam of JobExams) {
            if (exam.exam && exam.exam.duration) {
                total_time += exam.exam.duration;
            }
            if (exam.exam && exam.exam.questions) {
                total_questions += exam.exam.questions.length;
            }
        }

        return res.status(200).json({
            assessment_name: assessmentFound.position.positionName,
            total_questions,
            time: total_time,
            status: assessmentFound.status
        });

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

export const deleteApplicant = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { applicantId } = req.params;

        const deleteApplicant = await db.delete(applicant).where(eq(
            applicant.id, applicantId
        )).returning();

        console.log("deleteApplicant", deleteApplicant);


        return res.status(200).json({
            message: "Deleted successfully"
        })

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})