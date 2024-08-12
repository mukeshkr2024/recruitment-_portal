import { and, asc, desc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import db from "../db";
import { applicant, assessment, option, question, } from "../db/schema";
import { generateAccessCode } from "../utils";

export const getApplicantsAssessmentQuestions = async (req: Request, res: Response) => {
    try {

        const { assessmentId } = req.params;

        console.log(assessmentId);

        const AssesmentFound = await db.query.assessment.findFirst({
            where: eq(assessment.id, assessmentId)
        })

        if (!AssesmentFound) {
            throw new Error("Assessment not found")
        }

        console.log(AssesmentFound);

        const questions = await db.query.question.findMany({
            columns: {
                id: true,
                questionText: true
            },
            where: eq(question.positionId, AssesmentFound?.positionId),
            with: {
                options: {
                    columns: {
                        id: true,
                        optionText: true
                    }
                }

            }
        });

        return res.status(200).json(questions)

    } catch (error) {
        console.log(error);
    }
}

export const submitAssessment = async (req: Request, res: Response) => {
    try {
        const answers = req.body;

        if (!Array.isArray(answers) || answers.length === 0) {
            return res.status(400).json({ error: 'Invalid input: answers should be a non-empty array.' });
        }

        let totalScore = 0;

        console.log('Received answers:', answers);

        for (let answer of answers) {
            const correctOption = await db.query.option.findFirst({
                where: and(
                    eq(option.questionId, answer.questionId),
                    eq(option.isCorrect, true)
                )
            });

            if (!correctOption) {
                console.warn(`No correct option found for questionId: ${answer.questionId}`);
                continue;
            }

            console.log('Correct option:', correctOption);

            if (correctOption.id === answer.selectedOptionId) {
                totalScore += 1;
            }
        }

        const [applicant] = await db.query.applicant.findMany({ limit: 1 });
        const [position] = await db.query.position.findMany({ limit: 1 });

        if (!applicant || !position) {
            return res.status(404).json({ error: 'Applicant or position not found.' });
        }

        // const response = await db.insert(result).values({
        //     applicantId: applicant.id,
        //     appliedPositonId: position.id,
        //     score: totalScore,
        //     totalScore: answers.length,
        // }).returning();

        // console.log(response);

        return res.status(200).json({ totalScore });
    } catch (error) {
        console.error('Error submitting assessment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getApplicants = async (req: Request, res: Response) => {
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
        console.error("Error fetching applicants:", error);
        return res.status(500).json({ error: "Failed to fetch applicants." });
    }
};

export const getApplicantsByPositon = async (req: Request, res: Response) => {
    try {
        console.log("getApplicantsByPositon");

        const { positionId } = req.params

        const applicants = await db.query.assessment.findMany({
            where: eq(assessment.positionId, positionId),
            with: {
                applicant: true,
            }
        })

        console.log(applicants);

        return res.status(200).json(applicants)
    } catch (error) {
        console.log(error);

    }
}

export const getApplicantAssesment = async (req: Request, res: Response) => {
    try {

        const applicantId = req.id;

        if (!applicantId) return

        console.log(applicantId);

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

                    }
                },

            },
            orderBy: asc(assessment.createdAt)
        })

        return res.status(200).json(assessments)
    } catch (error) {
        console.log(error);

    }
}


export const registerApplicant = async (req: Request, res: Response) => {
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

        // create assesment 

        const assesment = await db.insert(assessment).values({
            applicantId: foundApplicant[0].id,
            positionId: appliedFor
        }).returning()

        console.log(assesment);


        return res.status(201).json({
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}

export const getJobPostions = async (Req: Request, res: Response) => {
    try {

        const jobPositions = await db.query.position.findMany({
            columns: {
                id: true,
                positionName: true
            }
        })

        return res.status(200).json(jobPositions)

    } catch (error) {
        console.log(error);

    }
}