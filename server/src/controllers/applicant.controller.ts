import { and, desc, eq, inArray } from "drizzle-orm";
import { NextFunction, Request, Response } from "express";
import db from "../db";
import { applicant, assessment, exam, examResult, jobPositionExams, option, position } from "../db/schema";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateAccessCode } from "../utils";
import { ErrorHandler } from "../utils/ErrorHandler";
import { sendMail } from "../utils/sendMail";
import env from '../config/env'

export const getApplicantsAssessmentQuestions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { examId, assessmentId } = req.params;

        const applicantId = req.id;

        await db.update(applicant).set({
            status: "INPROGRESS"
        }).where(
            eq(applicant.id, applicantId!)
        )

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
                    applicantId: applicantId!,
                    examId: examId,
                    assessmentId: assessmentId!,
                    score: 0,
                    totalScore: examFound?.questions.length || 0,
                    status: "INPROGRESS"
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

        if (!Array.isArray(answers) || answers?.length === 0) {
            return res.status(400).json({ error: 'Invalid input: answers should be a non-empty array.' });
        }

        let totalScore = 0;

        const maxScore = answers?.length;

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

        if (!isExamResultExist) {
            await db.insert(examResult).values({
                applicantId: req.id!,
                examId: examId,
                assessmentId: assementId,
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

        const { job, status } = req.query;

        let query;

        if (job) {
            // @ts-ignore
            query = eq(assessment.positionId, job);
        }

        const result = await db.query.assessment.findMany({
            with: {
                applicant: true,
                position: true,
            },
            orderBy: desc(assessment.createdAt),
            where: query
        })

        const filteredResut = status ? result.filter(assessment => assessment?.applicant?.status!.toLowerCase() === status) : result

        return res.status(200).json(filteredResut)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});


export const getApplicantsDownloadData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const applicants = await db.query.applicant.findMany({
            with: {
                examResults: {
                    with: {
                        exam: true,
                        assessment: {
                            with: {
                                position: true
                            }
                        },
                    }
                },
            }
        });


        // @ts-ignore
        const formattedApplicants = applicants.map(applicant => {
            const formattedExamResults = applicant.examResults.map(examResult => ({
                examStatus: examResult.examStatus,
                exam: {
                    name: examResult.exam.name,
                    duration: examResult.exam.duration
                },
                position: {
                    positionName: examResult.assessment.position.positionName
                },
                score: examResult.score,
                totalScore: examResult.totalScore
            }));

            return {
                id: applicant.id,
                firstName: applicant.firstName,
                lastName: applicant.lastName,
                email: applicant.email,
                accessCode: applicant.accessCode,
                status: applicant.status,
                phone: applicant.phone,
                createdAt: new Date(applicant.createdAt).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }),
                examResults: formattedExamResults.length > 0 ? formattedExamResults : [{
                    examStatus: 'N/A',
                    exam: {
                        name: 'N/A',
                        duration: 'N/A'
                    },
                    position: {
                        positionName: 'N/A'
                    },
                    score: 'N/A',
                    totalScore: 'N/A'
                }]
            };
        });

        return res.status(200).json(formattedApplicants);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});



export const getApplicantsByPositon = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { positionId } = req.params

        const applicants = await db.query.assessment.findMany({
            where: eq(assessment.positionId, positionId),
            with: {
                applicant: true,
                position: true,
            }
        })


        return res.status(200).json(applicants)
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const getApplicantAssessment = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const applicantId = req.id;

    if (!applicantId) {
        return next(new ErrorHandler("Invalid applicant ID", 400));
    }

    const applicantPositions = await db.query.applicant.findFirst({
        where: eq(applicant.id, applicantId),
        with: {
            assements: {
                with: { position: true }
            },
            examResults: true,
        }
    });

    if (!applicantPositions) {
        return next(new ErrorHandler("Applicant not found", 404));
    }

    const examResults = applicantPositions.examResults;

    const positionIds = applicantPositions.assements?.map(assessment => assessment.positionId) || [];

    const positionExams = await db.query.jobPositionExams.findMany({
        where: and(inArray(jobPositionExams.positionId, positionIds), eq(jobPositionExams.isActive, true)),
        with: {
            exam: { with: { questions: true } }
        }
    });


    const positionMap = applicantPositions.assements?.reduce((acc: any, assessment: any) => {
        const { positionId, position, id: assessmentId } = assessment;
        const positionName = position.positionName;

        if (!acc[assessmentId]) {
            acc[assessmentId] = {
                id: assessmentId,
                position_name: positionName,
                exams: []
            };
        }

        const exams = positionExams.filter(exam => exam.positionId === positionId);

        exams.forEach(exam => {
            const examId = exam.exam.id;

            const examResult = examResults?.find(r => r.examId === examId && r.assessmentId === assessmentId);
            const status = examResult?.status || "PENDING";

            acc[assessmentId].exams.push({
                examId,
                name: exam.exam.name,
                status
            });
        });

        return acc;
    }, {} as Record<string, { id: string, position_name: string, exams: { examId: string, name: string, status: string }[] }>);


    const result = Object.values(positionMap);

    res.status(200).json(result);
});



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

        const assessmentEntry = await db.insert(assessment)
            .values({
                applicantId: foundApplicant.id,
                positionId: positionId,
            })
            .returning();


        const login_link = env.SITE_URL + "/applicant-login";

        const emailData = {
            name: `${firstName} ${lastName}`,
            email: foundApplicant.email,
            position: positionFound.positionName,
            access_code: access_code,
            login_link: login_link
        };

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


        const examFound = await db.query.exam.findFirst({
            where: eq(exam.id, examId),
            with: {
                questions: true
            }
        })

        if (!examFound) {
            return next(new ErrorHandler("Exam not found", 400));
        }

        return res.status(200).json({
            exam_name: examFound.name,
            total_questions: examFound.questions?.length || 0,
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
                        },
                    },
                    assessment: {
                        columns: {},
                        with: {
                            position: {
                                columns: {
                                    positionName: true
                                }
                            }
                        }
                    }
                }
                ,
                columns: {
                    id: true,
                    score: true,
                    totalScore: true,
                    status: true,
                    examStatus: true
                }
            }
        )

        return res.status(200).json({
            details: applicantFound,
            result: examResults,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})

export const updateApplicantStatus = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { applicantId } = req.params;
        const { status } = req.body;

        if (!status) {
            throw new Error("Status is required")
        }

        const updateApplicant = await db.update(applicant).set({
            status: status
        }).where(eq(applicant.id, applicantId))

        if (!updateApplicant) {
            throw new Error("Applicant does not exist")
        }

        return res.status(200).json({
            message: "Status updated successfully"
        })

    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
})