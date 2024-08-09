import express from "express";
import { getApplicants, getApplicantsAssessmentQuestions, submitAssessment } from "../controllers/applicant.controller";

const applicantRouter = express.Router();

applicantRouter.get("/", getApplicants)
applicantRouter.get("/assesment-questions", getApplicantsAssessmentQuestions)
applicantRouter.post("/submit-assessment", submitAssessment)


export { applicantRouter };