import { applicantDetail, deleteApplicant, getApplicantAssessment, getJobPostions, registerApplicant, updateApplicantStatus } from "../controllers/applicant.controller";
import express from "express";
import { isApplicantAuthenticated } from "../middleware/auth";

const applicantRouter = express.Router();

applicantRouter.get("/assessments", isApplicantAuthenticated, getApplicantAssessment)
applicantRouter.get("/job-positions", getJobPostions)
applicantRouter.post("/register/:positionId", registerApplicant)
applicantRouter.delete("/:applicantId", deleteApplicant)
applicantRouter.get("/details/:applicantId", applicantDetail)
applicantRouter.patch("/:applicantId", updateApplicantStatus)

export { applicantRouter }; 