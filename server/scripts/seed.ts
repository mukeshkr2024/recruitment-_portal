import { eq, desc } from "drizzle-orm";
import db from "../src/db";
import { applicant, examResult } from "../src/db/schema";

const main = async () => {
    try {
        const examId = "d34888b3-8b75-4659-852d-0a6bc27439c3";

        const topStudents = await db.query.examResult.findMany({
            where: eq(examResult.examId, examId),
            orderBy: desc(examResult.score),
            limit: 50 // Use 'take' instead of 'limit'
        });

        // Extracting details of the top 50 students
        const students = await Promise.all(topStudents.map(async (result) => {
            const student = await db.query.applicant.findFirst({
                where: eq(applicant.id, result.applicantId)
            });

            return {
                name: `${student?.firstName} ${student?.lastName}`, // Corrected syntax for string concatenation
                email: student?.email,
                phone: student?.phone,
                score: result.score,
            };
        }));

        console.log("Top 50 Students:", students);

    } catch (error) {
        console.error("Error processing exam results:", error);
    }
};

main();
