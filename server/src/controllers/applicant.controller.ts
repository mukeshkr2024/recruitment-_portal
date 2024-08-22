import { and, arrayContains, asc, desc, eq, inArray } from "drizzle-orm";
import e, { application, NextFunction, Request, Response } from "express";
import db from "../db";
import { applicant, assessment, exam, examResult, jobPositionExams, option, position, question, } from "../db/schema";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateAccessCode } from "../utils";
import { ErrorHandler } from "../utils/ErrorHandler";
import { sendMail } from "../utils/sendMail";

export const getApplicantsAssessmentQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId, assessmentId } = req.params;

        console.log("assementId", assessmentId);


        const applicantId = req.id;

        const examFound = await db.query.exam.findFirst({
            where: eq(exam.id, examId),
            columns: {
                name: true,
                duration: true
            },
            with: {
                questions: {
                    columns: {
                        id: true,
                        questionText: true
                    },
                    with: {
                        options: {
                            columns: {
                                id: true,
                                optionText: true,
                            }
                        }
                    }
                }
            }
        })

        const isExamResultExist = await db.query.examResult.findFirst({
            where: and(eq(examResult.examId, examId), eq(examResult.applicantId, applicantId!))
        })

        if (!isExamResultExist) {
            await db.insert(examResult).values(
                {
                    applicantId: applicantId,
                    examId: examId,
                    score: 0,
                    totalScore: 0,
                    status: "IN_PROGRESS"
                }
            ).returning()
        }

        if (!examFound) {
            throw new Error("Exam not found")
        }

        return res.status(200).json({
            exam_name: examFound.name,
            questions: examFound.questions,
            total_time: examFound.duration
        })

    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});

export const submitAssessment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId, assementId } = req.params;
        const answers = req.body;

        console.log("assementId", assementId);


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


        const isExamResultExist = await db.query.examResult.findFirst({
            where: and(eq(examResult.examId, examId), eq(examResult.applicantId, req.id!))
        })

        console.log("assementId", assementId);


        if (!isExamResultExist) {
            await db.insert(examResult).values({
                applicantId: req.id,
                examId: examId,
                score: totalScore,
                totalScore: maxScore,
                status: "COMPLETED",
            }).returning();
        }

        const result = await db.update(examResult).set({
            score: totalScore,
            status: "COMPLETED",
        }).where(
            and(eq(examResult.examId, examId), eq(examResult.applicantId, req.id!))
        ).returning();


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

        if (!applicantId) {
            return next(new ErrorHandler("Invalid applicant ID", 400));
        }

        const applicantPositions = await db.query.applicant.findFirst({
            where: eq(applicant.id, applicantId),
            with: {
                assements: {
                    with: {
                        position: true,
                    }
                },
                examResults: true,
            }
        })

        const examResultIds = applicantPositions?.examResults.map(result => result.examId)

        const positionIds = applicantPositions?.assements.map(assement => assement.positionId);

        const positionExams = await db.query.jobPositionExams.findMany({
            // @ts-ignore 
            where: inArray(jobPositionExams.positionId, positionIds),
            with: {
                exam: {
                    with: {
                        questions: true
                    }
                }
            }
        });

        const positionMap = applicantPositions?.assements.reduce((acc, assessment) => {
            const positionId = assessment.positionId;
            const positionName = assessment.position.positionName;

            if (!acc[positionId]) {
                acc[positionId] = {
                    position_name: positionName,
                    exams: []
                };
            }

            const exams = positionExams.filter(exam => exam.positionId === positionId);

            console.log("positionId", positionId);


            exams.forEach(exam => {
                acc[positionId].exams.push({
                    examId: exam.exam.id,
                    name: exam.exam.name,
                    status: examResultIds?.includes(exam.exam.id)
                        ? applicantPositions.examResults.find(e => e.examId === exam.exam.id)?.status || "PENDING"
                        : "PENDING"
                });
            });

            return acc;
        }, {} as Record<string, { position_name: string, exams: { examId: string, name: string, status: string }[] }>);

        //@ts-ignore
        const result = Object.entries(positionMap).map(([id, details]) => ({
            id,
            ...details
        }));

        res.status(200).json(result);

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const registerApplicant = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, phone } = req.body;

    const { positionId } = req.params;

    // Check for missing fields
    if (!firstName || !lastName || !email || !phone) {
        return next(new ErrorHandler("All fields are required", 400));
    }

    try {
        const positionFound = await db.query.position.findFirst({
            where: eq(position.id, positionId),
        });

        if (!positionFound) {
            return next(new ErrorHandler("Invalid position ID", 400));
        }

        // Check if applicant already exists
        const existingApplicant = await db.query.applicant.findFirst({
            where: eq(applicant.email, email),
        });

        // If applicant exists, check if they're already registered for the position
        if (existingApplicant) {
            const isAlreadyRegistered = await db.query.assessment.findFirst({
                where: and(
                    eq(assessment.positionId, positionId),
                    eq(assessment.applicantId, existingApplicant.id),
                ),
            });

            if (isAlreadyRegistered) {
                return next(new ErrorHandler("You are already registered for this position", 400));
            }
        }

        // Generate a new access code
        const access_code = generateAccessCode(8);
        let foundApplicant;

        // Update existing applicant or insert a new one
        if (existingApplicant) {
            [foundApplicant] = await db.update(applicant)
                .set({ accessCode: access_code })
                .where(eq(applicant.email, existingApplicant.email))
                .returning();
        } else {
            [foundApplicant] = await db.insert(applicant)
                .values({
                    firstName,
                    lastName,
                    email,
                    phone,
                    accessCode: access_code,
                })
                .returning();
        }

        // Insert into the assessment table
        const assessmentEntry = await db.insert(assessment)
            .values({
                applicantId: foundApplicant.id,
                positionId: positionId,
            })
            .returning();

        // Prepare data for the email
        const emailData = {
            name: `${foundApplicant.firstName} ${foundApplicant.lastName}`,
            email: foundApplicant.email,
            position: positionFound.positionName, // You should replace this with the actual position title
            access_code: access_code,
        };

        // Send registration email
        try {
            await sendMail({
                email: foundApplicant.email,
                subject: "Applicant Registration",
                template: "register-mail.ejs",
                data: emailData,
            });
        } catch (error) {
            console.error("Error sending email:", error);
            return next(new ErrorHandler("Failed to send email", 500));
        }

        // Respond with success
        return res.status(201).json({ success: true });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
});


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
        const { examId } = req.params;

        console.log("examId: " + examId);

        const examFound = await db.query.exam.findFirst({
            where: eq(exam.id, examId),
            with: {
                questions: true
            }
        })

        console.log("examFound", examFound);

        if (!examFound) {
            return next(new ErrorHandler("Exam not found", 400));
        }

        return res.status(200).json({
            exam_name: examFound.name,
            total_questions: examFound.questions.length || 0,
            total_time: examFound.duration,
            status: "success",
        })


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


export const applicantDetail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { applicantId } = req.params;

        const applicantFound = await db.query.applicant.findFirst({
            where: eq(applicant.id, applicantId),
            with: {
                assements: {
                    columns: {
                        createdAt: true
                    },
                    with: {
                        position: {
                            columns: {
                                positionName: true
                            }
                        }
                    }
                }
            }
        })

        const examResults = await db.query.examResult.findMany(
            {
                where: and(eq(examResult.applicantId, applicantId)),
                with: {
                    exam: {
                        columns: {
                            name: true,
                            duration: true,
                        }
                    },
                }
                ,
                columns: {
                    id: true,
                    score: true,
                    totalScore: true,
                    status: true
                }
            }
        )

        console.log("examResults", examResults);

        console.log(applicantFound);

        return res.status(200).json({
            details: applicantFound,
            result: examResults,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})