import express from 'express';
import { getCodingQuestions, getSavedAnswer, saveCodingAnswer, submitCodingExam } from '../controllers/coding-exam.controller';
import { isApplicantAuthenticated } from '../middleware/auth';

export const codingExamRouter = express.Router();

codingExamRouter.get("/:assessmentId/exam/:examId", isApplicantAuthenticated, getCodingQuestions)
codingExamRouter.post("/:assessmentId/exam/:examId/save", isApplicantAuthenticated, saveCodingAnswer)
codingExamRouter.get("/:assessmentId/exam/:examId/save/:questionId", isApplicantAuthenticated, getSavedAnswer)
codingExamRouter.post("/:assessmentId/exam/:examId/submit", isApplicantAuthenticated, submitCodingExam)