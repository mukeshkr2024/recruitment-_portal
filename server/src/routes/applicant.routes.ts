import express from "express";
import { getApplicantsAssessmentQuestions, submitAssessment } from "../controllers/applicant.controller";

const applicantRouter = express.Router();

applicantRouter.get("/assesment-questions", getApplicantsAssessmentQuestions)
applicantRouter.post("/submit-assessment", submitAssessment)

export { applicantRouter };