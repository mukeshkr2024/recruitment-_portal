import express from 'express';
import { getCodingQuestions, saveCodingAnswer } from '../controllers/coding-exam.controller';
import { isApplicantAuthenticated } from '../middleware/auth';

export const codingExamRouter = express.Router();

codingExamRouter.get("/:assessmentId/exam/:examId", getCodingQuestions)
codingExamRouter.post("/:assessmentId/exam/:examId/save", isApplicantAuthenticated, saveCodingAnswer)