import { Request, Response } from "express";
import db from "../db";

export const getAnalytics = async (req: Request, res: Response) => {
    try {
        console.log("getAnalytics");

        const job_positons = await db.query.position.findMany({
            columns: {
                id: true,
                positionName: true,
            }
        })

        const applicants = await db.query.applicant.findMany({

        })


        return res.status(200).json({
            job_positons,
            total_applicants: applicants?.length || 0
        })
    } catch (error) {
        console.log(error);

    }
}