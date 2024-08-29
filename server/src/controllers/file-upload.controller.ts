import express, { Request, Response } from 'express';
import multer from 'multer';
import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';
import db from '../db';
import { and, eq } from 'drizzle-orm';
import { question, option } from '../db/schema';

const upload = multer({ dest: 'uploads/' });

const fileRouter = express.Router();

async function readDocx(filePath: string): Promise<string | null> {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value;
    } catch (error) {
        console.error('Error reading DOCX file:', error);
        return null;
    }
}

function parseQuestions(text: string) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const questions: Array<{ text: string; options: string[]; correctOption: string | null }> = [];
    let question: { text: string; options: string[]; correctOption: string | null } | null = null;

    lines.forEach(line => {
        if (line.match(/^\d+\./)) {
            if (question) {
                questions.push(question);
            }
            question = { text: line.split('.')[1].trim(), options: [], correctOption: null };
        } else if (line.match(/^[A-D]\./)) {
            question?.options.push(line.substring(3).trim());
        } else if (line.startsWith('Correct. ')) {
            question!.correctOption = line.substring(9).trim();
        }
    });

    if (question) {
        questions.push(question);
    }
    return questions;
}

fileRouter.post('/upload/:examId', upload.single('file'), async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const { examId } = req.params;
    const filePath = path.resolve(req.file.path);

    try {
        const text = await readDocx(filePath);
        if (!text) {
            throw new Error('Failed to extract text from DOCX');
        }

        const questions = parseQuestions(text);

        // Save the questions to the database
        const { createdQuestions, count } = await saveQuestions(questions, examId);

        // Clean up the uploaded file
        await fs.unlink(filePath);

        return res.status(200).json({
            message: `questions uploaded successfully.`,
            count: count
        });
    } catch (error) {
        console.error('Error processing file:', error);

        // Ensure file is always cleaned up, even in the event of an error
        try {
            await fs.unlink(filePath);
        } catch (cleanupError) {
            console.error('Error cleaning up uploaded file:', cleanupError);
        }

        return res.status(500).send('Error processing file.');
    }
});

const saveQuestions = async (questions: Array<{ text: string; options: string[]; correctOption: string | null }>, examId: string) => {
    const createdQuestions = [];
    let createdCount = 0;

    for (const questionData of questions) {
        const { text, options, correctOption } = questionData;

        // Check if question already exists in the database
        const isAlreadyQuestionExist = await db.query.question.findFirst({
            where: and(eq(question.questionText, text), eq(question.examId, examId))
        });

        if (isAlreadyQuestionExist) {
            console.warn(`Question "${text}" already exists. Skipping...`);
            continue; // Skip if question already exists
        }

        // Insert the question into the database
        const createdQuestion = await db.insert(question).values({
            examId: examId,
            questionText: text
        }).returning();

        const questionId = createdQuestion[0].id;

        // Prepare the options for insertion
        const optionsValues = options.map((optionText, index) => ({
            questionId: questionId,
            optionText: optionText,
            isCorrect: correctOption === String.fromCharCode(65 + index) // 'A' -> index 0, 'B' -> index 1, etc.
        }));

        // Insert the options into the database
        const insertedOptions = await db.insert(option).values(optionsValues).returning();

        // Add the created question and its options to the response list
        createdQuestions.push({
            question: createdQuestion[0],
            options: insertedOptions
        });

        // Increment the created questions count
        createdCount++;
    }

    return { createdQuestions, count: createdCount };
};

export { fileRouter };
