import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import axios from "axios";

const endpoint = "https://emkc.org/api/v2/piston/execute";

export const compileCode = CatchAsyncError(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("Called compileCode endpoint");
            const data = req.body;

            console.log("Request body:", req.body);

            // Make the API request to the external service
            const response = await axios.post(endpoint, data);

            // Send the data back to the client
            return res.json(response.data); // Send the response as JSON
        } catch (error) {
            console.error("Error occurred during code compilation:", error);
            return next(new ErrorHandler(error, 400));
        }
    }
);
