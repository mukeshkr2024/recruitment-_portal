import express from "express";
import { getApplicants, getApplicantsAssessmentQuestions, getApplicantsByPositon, getJobPostions, registerApplicant, submitAssessment } from "../controllers/applicant.controller";

const applicantsRouter = express.Router();

applicantsRouter.get("/", getApplicants)
applicantsRouter.get("/position/:positionId", getApplicantsByPositon)
applicantsRouter.get("/assesment-questions/:examId", getApplicantsAssessmentQuestions)
applicantsRouter.post("/submit-assessment/:assementId", submitAssessment)


export { applicantsRouter };

