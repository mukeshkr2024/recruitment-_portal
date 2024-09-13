import { NextFunction, Request, Response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import db from "../db";
import { applicant, assessment, position } from "../db/schema";
import { eq } from "drizzle-orm";
import { sendMailWithCustomBody } from "../utils/sendMail";

export const sendMail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type, subject, body, recipient, jobPosition, status } = req.body;

        // Validate required fields
        if (!type || !subject || !body || !jobPosition || !status) {
            return next(new ErrorHandler("All fields are required", 400));
        }

        // Validate 'recipient' field if type is 'individual'
        if (type === "individual" && !recipient) {
            return next(new ErrorHandler("Recipient is required for individual emails", 400));
        }

        // Check if job position exists
        const jobPositionFound = await db.query.position.findFirst({
            where: eq(position.id, jobPosition)
        });

        if (!jobPositionFound) {
            return next(new ErrorHandler("Job position not found", 404));
        }

        if (type === "individual") {
            // Validate if recipient exists (if needed)
            const applicantFound = await db.query.applicant.findFirst({
                where: eq(applicant.email, recipient)
            });

            if (!applicantFound) {
                return next(new ErrorHandler("Applicant not found with this email:- " + recipient, 404));
            }

            // Send email to individual
            await sendMailWithCustomBody({
                email: recipient,
                subject,
                html: body,
            });

        } else {
            const assessments = await db.query.assessment.findMany({
                where: eq(assessment.positionId, jobPositionFound.id),
                with: {
                    applicant: true
                }
            });

            for (const assessment of assessments) {
                if (assessment.applicant.status?.toLowerCase() === status.toLowerCase()) {
                    await sendMailWithCustomBody({
                        email: assessment.applicant.email,
                        subject,
                        html: body,
                    });
                    // TODO: sendMailWithCustomBody
                    console.log("email sent", assessment.applicant.email);
                }
            }
        }

        res.status(200).json({ message: "Emails sent successfully" });

    } catch (error) {
        next(new ErrorHandler(error, 500));
    }
});