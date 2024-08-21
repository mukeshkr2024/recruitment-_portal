import express from "express";
import { getApplicants, getApplicantsAssessmentQuestions, getApplicantsByPositon, getJobPostions, registerApplicant, submitAssessment } from "../controllers/applicant.controller";
import { isApplicantAuthenticated } from "../middleware/auth";

const applicantsRouter = express.Router();

applicantsRouter.get("/", getApplicants)
applicantsRouter.get("/position/:positionId", getApplicantsByPositon)
applicantsRouter.get("/assesment-questions/:assessmentId/exam/:examId", getApplicantsAssessmentQuestions)
applicantsRouter.post("/submit-assessment/:assementId/exam/:examId", isApplicantAuthenticated, submitAssessment)


export { applicantsRouter };

