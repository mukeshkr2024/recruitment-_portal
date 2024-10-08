import express from 'express';
import { getCodingQuestions } from '../controllers/coding-exam.controller';

export const codingExamRouter = express.Router();

codingExamRouter.get("/:assessmentId/exam/:examId", getCodingQuestions)