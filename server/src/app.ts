import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { getAnalytics } from "./controllers/analytics.controoler";
import { getInstructionsDetails } from "./controllers/applicant.controller";
import { createExam, createPositionExam, deletePositionExam, getExamQuestions, getExams, getPositionExams, updateExamDuration, updatePostionExam } from "./controllers/exams-controller";
import { createPosition, deletePosition, getPosition, getPostions, updatePosition } from "./controllers/position.controller";
import { createQuestion, deleteQuestion, getQuestion, getQuestionsByPostionId, updateQuestion } from "./controllers/question.controller";
import { isAdminAuthenticated } from "./middleware/auth";
import { ErrorMiddleware } from "./middleware/error";
import { applicantRouter } from "./routes/applicant.routes";
import { applicantsRouter } from "./routes/applicants.routes";
import { authRouter } from "./routes/auth.routes";

export const app = express()

// cookie parser
app.use(cookieParser());

// logging 
app.use(morgan("dev"));

// parse body
app.use(express.json({ limit: "50mb" }))

// CORS configuration
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173", "https://assessment-client-sigma.vercel.app", "http://82.112.227.200:4173", "http://careers.codingcommando.in"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Handle preflight requests
app.options("*", cors());

// test routes
app.get("/api/v1/test", (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Api is working"
    })
})

app.get("/api/v1/positions", isAdminAuthenticated, getPostions)
app.get("/api/v1/positions/:positionId", getPosition)
app.post("/api/v1/positions", createPosition)
app.delete("/api/v1/positions/:positionId", deletePosition)
app.get("/api/v1/questions/:positionId", getQuestionsByPostionId)
app.post("/api/v1/questions/:examId", createQuestion)
app.delete("/api/v1/questions/:questionId", deleteQuestion)
app.get("/api/v1/question/:questionId", getQuestion)
app.put("/api/v1/question/:questionId", updateQuestion)
app.patch("/api/v1/position/duration-update/:positionId", updatePosition)
app.get('/api/v1/instructions/:assementId/exam/:examId', getInstructionsDetails)
app.get("/api/v1/analytics", getAnalytics)

// applicants 
app.use("/api/v1/applicants", applicantsRouter)
app.use("/api/v1/applicant", applicantRouter)
app.use("/api/v1/auth", authRouter)

// exams 
app.get("/api/v1/exams", getExams);
app.get("/api/v1/exams/:examId", getExamQuestions);
app.post("/api/v1/exams", createExam)
app.patch("/api/v1/exam/duration-update/:examId", updateExamDuration)
app.get('/api/v1/position-exams/:positionId', getPositionExams)
app.patch('/api/v1/position-exams/:examId/:positionId', updatePostionExam)
app.delete('/api/v1/position-exams/:examId/:positionId', deletePositionExam)
app.post('/api/v1/position-exams/:examId/:positionId', createPositionExam)

// unknown api request  
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
    err.status = 404;
    next(err);
});

// error handling middleware
app.use(ErrorMiddleware)