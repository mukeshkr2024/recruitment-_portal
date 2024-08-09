
import express from 'express';
import { applicantDetail, applicantLogin } from '../controllers/auth.controller';
import { isApplicantAuthenticated } from '../middleware/auth';

const authRouter = express.Router();

authRouter.post("/applicant-login", applicantLogin);
authRouter.get("/applicant-details", isApplicantAuthenticated, applicantDetail)

export { authRouter }   