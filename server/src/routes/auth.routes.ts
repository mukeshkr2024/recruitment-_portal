
import express from 'express';
import { applicantDetail, applicantLogin, logout, userDetail, userLogin } from '../controllers/auth.controller';
import { isAdminAuthenticated, isApplicantAuthenticated } from '../middleware/auth';

const authRouter = express.Router();

authRouter.post("/applicant-login", applicantLogin);
authRouter.post("/admin-login", userLogin);
authRouter.get("/applicant-details", isApplicantAuthenticated, applicantDetail)
authRouter.get("/admin-details", isAdminAuthenticated, userDetail)
authRouter.post("/admin-logout", logout)
authRouter.post("/applicant-logout", logout)

export { authRouter }   