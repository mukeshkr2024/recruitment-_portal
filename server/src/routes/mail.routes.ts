import express from "express";
import { sendMail } from "../controllers/mail.controller";

export const mailRouter = express.Router();

mailRouter.post("/send-mail", sendMail)