import { eq, desc } from "drizzle-orm";
import db from "../src/db";
import { examResult } from "../src/db/schema";

const main = async () => {
    try {
        const examId = "d34888b3-8b75-4659-852d-0a6bc27439c3";

        const topStudents = await db.query.examResult.findMany({
            where: eq(examResult.examId, examId),
            orderBy: desc(examResult.score),
            limit: 50
        })

        // Extracting IDs of the top 50 students
        const students = topStudents.map(result => {
            return {
                id: result.id,
                score: result.score,
            }
        });

        console.log("Top 50 Students' IDs:", students);

    } catch (error) {
        console.error("Error processing exam results:", error);
    }
};

main();
