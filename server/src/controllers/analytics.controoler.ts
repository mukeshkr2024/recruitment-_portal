import { NextFunction, Request, Response } from "express";
import db from "../db";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { ErrorHandler } from "../utils/ErrorHandler";
import { applicant, assessment, exam, jobPositionExams, position } from "../db/schema";
import { and, count, desc, gte, lte } from "drizzle-orm";

export const getAnalytics = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log(req.query);

        const { start, end } = req.query;

        // Validate and parse date parameters
        let startDate: Date | null = null;
        let endDate: Date | null = null;

        if (start && end) {
            startDate = new Date(start as string);
            endDate = new Date(end as string);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ message: "Invalid date format." });
            }
        }

        // Prepare query conditions
        const assessmentCondition = startDate && endDate ? and(gte(assessment.createdAt, startDate), lte(assessment.createdAt, endDate)) : undefined;

        const positionCondition = startDate && endDate ? and(gte(position.createdAt, startDate), lte(position.createdAt, endDate)) : undefined;

        const examsConductedCondition = startDate && endDate ? and(gte(exam.createdAt, startDate), lte(exam.createdAt, endDate)) : undefined;

        const jobPositionExamsCondition = startDate && endDate ? and(gte(jobPositionExams.createdAt, startDate), lte(jobPositionExams.createdAt, endDate)) : undefined;

        // Fetch data
        const [applicantsResult, positionsResult, examsResult, positionsDataResult, examsConductedResult, recentApplicantsResult] = await Promise.all([
            db.select({ count: count() }).from(assessment).where(assessmentCondition),
            db.select({ count: count() }).from(position).where(positionCondition),
            db.select({ count: count() }).from(exam).where(examsConductedCondition),
            db.query.position.findMany({
                columns: {
                    positionName: true
                },
                with: {
                    assesment: {
                        columns: {
                            id: true
                        }
                    }
                },
                where: positionCondition
            }),
            db.select({ count: count() }).from(jobPositionExams).where(jobPositionExamsCondition),
            db.query.assessment.findMany({
                columns: {
                    id: true
                },
                with: {
                    position: {
                        columns: {
                            positionName: true
                        }
                    },
                    applicant: {
                        columns: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
                orderBy: desc(applicant.createdAt),
                limit: 6,
                where: assessmentCondition
            })
        ]);

        const formattedData = positionsDataResult.map(item => ({
            position: item.positionName,
            applicants: item?.assesment?.length || 0
        }));

        return res.status(200).json({
            applicants: applicantsResult[0].count,
            positions: positionsResult[0].count,
            exams: examsResult[0].count,
            examsConducted: examsConductedResult[0].count,
            recentApplicants: recentApplicantsResult,
            positionsData: formattedData
        });
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
});
