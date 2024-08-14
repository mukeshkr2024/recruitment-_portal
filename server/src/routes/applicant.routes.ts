import { deleteApplicant, getApplicantAssesment, getJobPostions, registerApplicant } from "../controllers/applicant.controller";
import express from "express";
import { isApplicantAuthenticated } from "../middleware/auth";

const applicantRouter = express.Router();

applicantRouter.get("/assessments", isApplicantAuthenticated, getApplicantAssesment)
applicantRouter.get("/job-positions", getJobPostions)
applicantRouter.post("/register", registerApplicant)
applicantRouter.delete("/:applicantId", deleteApplicant)

export { applicantRouter }; 