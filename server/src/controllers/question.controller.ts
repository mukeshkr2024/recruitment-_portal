import { asc, desc, eq } from "drizzle-orm";
import { Request, Response } from "express";
import db from "../db";
import { option, position, question, } from "../db/schema";

export const getQuestionsByPostionId = async (req: Request, res: Response) => {
    try {

        const { positionId } = req.params;

        const jobPositon = await db.query.position.findFirst({
            where: eq(position.id, positionId)
        })

        if (!jobPositon) {
            throw new Error("Job position not found")
        }

        const questions = await db.query.question.findMany({
            where: eq(question.positionId, jobPositon.id),
            orderBy: asc(question.createdAt)
        })

        return res.status(200).json(questions)
    } catch (error) {
        console.log(error);
    }
}

export const createQuestion = async (req: Request, res: Response) => {
    try {

        const { positionId } = req.params;

        const { questionText, answer1, answer2, answer3, answer4 } = req.body;



        const isAlreadyQuestionExist = await db.query.question.findFirst({
            where: eq(question.questionText, questionText)
        })


        if (isAlreadyQuestionExist) {
            throw new Error("Question already exist")
        }

        const createdQuestion = await db.insert(question).values([{
            positionId: positionId,
            questionText: questionText,
        }]).returning()

        const options = await db.insert(option).values([{
            questionId: createdQuestion[0].id,
            optionText: answer1?.text,
            isCorrect: answer1?.isCorrect,
        }, {
            questionId: createdQuestion[0].id,
            optionText: answer2?.text,
            isCorrect: answer2?.isCorrect,
        }, {
            questionId: createdQuestion[0].id,
            optionText: answer3?.text,
            isCorrect: answer3?.isCorrect,
        }, {
            questionId: createdQuestion[0].id,
            optionText: answer4?.text,
            isCorrect: answer4?.isCorrect,
        }]).returning()

        return res.status(200).json({
            question: createdQuestion[0],
            options: options
        })

    } catch (error) {
        console.log(error);

    }
}

export const deleteQuestion = async (req: Request, res: Response) => {
    try {

        const { questionId } = req.params;


        const response = await db.delete(question).where(eq(question.id, questionId)).returning()


        return res.status(200).json(response)

    } catch (error) {
        console.log(error);

    }
}

export const getQuestion = async (req: Request, res: Response) => {
    try {

        const { questionId } = req.params;

        const response = await db.query.question.findFirst({
            where: eq(question.id, questionId),
            with: {
                options: {
                    orderBy: asc(option.createdAt)
                }
            },
        })

        if (!response) {
            throw new Error("Question not found")
        }

        return res.status(200).json(response)

    } catch (error) {
        console.log(error);
    }
}


export const updateQuestion = async (req: Request, res: Response) => {
    try {

        const { questionId } = req.params;
        const { questionText, answer1, answer2, answer3, answer4 } = req.body;

        const questionExist = await db.query.question.findFirst(
            {
                where: eq(question.id, questionId),
                with: {
                    options: true
                }
            },
        )

        if (!questionExist) {
            throw new Error("Question not found")
        }

        console.log("questionExist", questionExist);

        const updatedQuestion = await db.update(question).set({
            questionText: questionText
        }).where(eq(question.id, questionId)).returning()


        const updatedOptions = [];
        const answers = [answer1, answer2, answer3, answer4];

        for (let i = 0; i < answers.length; i++) {
            if (answers[i]) {
                const optionId = questionExist.options[i]?.id;
                if (optionId) {
                    await db.update(option).set({
                        optionText: answers[i]?.text,
                        isCorrect: answers[i]?.isCorrect
                    }).where(eq(option.id, optionId))
                    updatedOptions.push({ id: optionId, text: answers[i] });
                }
            }
        }

        res.status(200).json(
            {
                question: updatedQuestion[0],
                options: updatedOptions
            }
        )

    } catch (error) {

    }
}