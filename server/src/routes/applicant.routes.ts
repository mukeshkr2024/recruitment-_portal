import express from "express";
import { getApplicants, getApplicantsAssessmentQuestions, getApplicantsByPositon, submitAssessment } from "../controllers/applicant.controller";

const applicantRouter = express.Router();

applicantRouter.get("/", getApplicants)
applicantRouter.get("/position/:positionId", getApplicantsByPositon)
applicantRouter.get("/assesment-questions", getApplicantsAssessmentQuestions)
applicantRouter.post("/submit-assessment", submitAssessment)


export { applicantRouter };