import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import { v1ApiRoutes } from "../routes/v1/index.routes";

export const app = express()

// logging 
app.use(morgan("dev"));

// parse body
app.use(express.json({ limit: "50mb" }))

// cors
app.use(cors());

// routes 

app.use("/api/v1", v1ApiRoutes)

// test routes
app.get("/api/v1/test", (req: Request, res: Response) => {
    return res.status(200).json({
        message: "Api is working"
    })
})

// unknown api request
app.all("*", (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`) as any;
    err.status = 404;
    next(err);
});