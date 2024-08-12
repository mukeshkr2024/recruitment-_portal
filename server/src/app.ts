import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { createPosition, deletePosition, getPostions } from "./controllers/position.controller";
import { createQuestion, deleteQuestion, getQuestion, getQuestionsByPostionId, updateQuestion } from "./controllers/question.controller";
import { applicantsRouter } from "./routes/applicants.routes";
import { authRouter } from "./routes/auth.routes";
import cookieParser from "cookie-parser"
import { isAdminAuthenticated } from "./middleware/auth";
import { getAnalytics } from "./controllers/analytics.controoler";
import { applicantRouter } from "./routes/applicant.routes";

export const app = express()

// cookie parser
app.use(cookieParser());

// logging 
app.use(morgan("dev"));

// parse body
app.use(express.json({ limit: "50mb" }))

//cors
app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true,
    })
);

// Routes 

// test routes
app.get("/api/v1/test", (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Api is working"
    })
})

app.get("/api/v1/positions", isAdminAuthenticated, getPostions)
app.post("/api/v1/positions", createPosition)
app.delete("/api/v1/positions/:positionId", deletePosition)
app.get("/api/v1/questions/:positionId", getQuestionsByPostionId)
app.post("/api/v1/questions/:positionId", createQuestion)
app.delete("/api/v1/questions/:questionId", deleteQuestion)
app.get("/api/v1/question/:questionId", getQuestion)
app.put("/api/v1/question/:questionId", updateQuestion)

app.get("/api/v1/analytics", getAnalytics)

// applicants 
app.use("/api/v1/applicants", applicantsRouter)
app.use("/api/v1/applicant", applicantRouter)
app.use("/api/v1/auth", authRouter)

// unknown api request
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
    err.status = 404;
    next(err);
});