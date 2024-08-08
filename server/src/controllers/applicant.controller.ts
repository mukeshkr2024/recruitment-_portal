import { Request, Response } from "express";
import db from "../db";
import { and, eq } from "drizzle-orm";
import { option, position, question } from "../db/schema";

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

        let totalScore = 0;

        console.log(answers);

        for (let answer of answers) {
            const correctOption = await db.query.option.findFirst({
                where: and(
                    eq(option.questionId, answer.questionId),
                    eq(option.isCorrect, true)
                )
            })

            console.log("correctOption", correctOption);

            console.log(correctOption?.id);
            console.log(answer.selectedOptionId);

            if (correctOption && correctOption.id === answer.selectedOptionId) {
                totalScore += 1;
            }

        }


        return res.status(200).json({ totalScore })
    } catch (error) {
        console.log(error);
    }
}