import { Request, Response } from "express";
import db from "../db";
import { and, eq } from "drizzle-orm";
import { applicant, option, position, question, result } from "../db/schema";

export const getApplicantsAssessmentQuestions = async (req: Request, res: Response) => {
    try {
        // get the assesment if of applicants and send the questions

        const positions = await db.query.position.findMany({})

        console.log("positions", positions);


        const questions = await db.query.question.findMany({
            where: eq(question.positionId, positions[0].id),
            with: {
                options: true
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

        const response = await db.insert(result).values({
            applicantId: applicant.id,
            appliedPositonId: position.id,
            score: totalScore,
            totalScore: answers.length,
        }).returning();

        console.log(response);


        return res.status(200).json({ totalScore, response });
    } catch (error) {
        console.error('Error submitting assessment:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getApplicants = async (Req: Request, res: Response) => {
    try {

        // const applicants = await db.query.applicant.findMany({

        // }).

        const applicants = await db.select(
            {

            }
        ).from(applicant)
            .leftJoin(position, eq(position.id, applicant.appliedFor));

        return res.status(200).json(applicants)
    } catch (error) {
        console.log(error);

    }
}