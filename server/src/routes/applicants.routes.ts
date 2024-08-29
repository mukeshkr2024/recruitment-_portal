import express from "express";
import { getApplicants, getApplicantsAssessmentQuestions, getApplicantsByPositon, getApplicantsDownloadData, getJobPostions, registerApplicant, submitAssessment } from "../controllers/applicant.controller";
import { isAdminAuthenticated, isApplicantAuthenticated } from "../middleware/auth";

const applicantsRouter = express.Router();

applicantsRouter.get("/", isAdminAuthenticated, getApplicants)
applicantsRouter.get("/download-data", isAdminAuthenticated, getApplicantsDownloadData)
applicantsRouter.get("/position/:positionId", getApplicantsByPositon)
applicantsRouter.get("/assesment-questions/:assessmentId/exam/:examId", isApplicantAuthenticated, getApplicantsAssessmentQuestions)
applicantsRouter.post("/submit-assessment/:assementId/exam/:examId", isApplicantAuthenticated, submitAssessment)


export { applicantsRouter };

