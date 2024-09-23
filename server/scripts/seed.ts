import { eq } from "drizzle-orm";
import db from "../src/db";
import { examResult } from "../src/db/schema";

const main = async () => {
    try {
        const examId = "d34888b3-8b75-4659-852d-0a6bc27439c3";

        const examResults = await db.query.examResult.findMany({
            where: eq(examResult.examId, examId)
        });

        let totalApplicantsHaving30 = 0;
        let totalApplicantsHaving35 = 0;

        for (const exam of examResults) {
            if (exam.score > 30) {
                totalApplicantsHaving30++;
            }

            if (exam.score > 35) {
                totalApplicantsHaving35++;
            }
        }

        console.log("Total results: " + examResults.length);
        console.log("Total having score more than 30: " + totalApplicantsHaving30);
        console.log("Total having score more than 35 " + totalApplicantsHaving35);

    } catch (error) {
        console.error("Error processing exam results:", error);
    }
};

main();
