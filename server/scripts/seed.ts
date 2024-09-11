import { eq, and } from "drizzle-orm";
import db from "../src/db";
import { applicant } from "../src/db/schema";

const main = async () => {
    try {
        const examResults = await db.query.examResult.findMany();

        // If there are no exam results, return early
        if (!examResults || examResults.length === 0) {
            console.log("No exam results found.");
            return;
        }

        // Group exams by applicantId
        const examsByApplicant = examResults.reduce((acc, exam: any) => {
            if (!acc[exam.applicantId]) {
                acc[exam.applicantId] = [];
            }
            acc[exam.applicantId].push(exam);
            return acc;
        }, {});

        // Process each applicant's exams
        const updatePromises = Object.entries(examsByApplicant).map(async ([applicantId, exams]) => {
            // Check if any exam has a failing score
            const hasRejectedExam = exams.some((exam: any) => exam.score < 20);

            const status = hasRejectedExam ? "REJECTED" : "SELECTED";

            // Update applicant's status based on the exam results
            const applicantUpdated = await db.update(applicant)
                .set({ status })
                .where(eq(applicant.id, applicantId))
                .returning();

            console.log(`Applicant ID ${applicantId} updated to status: ${status}`, applicantUpdated);
        });

        // Execute all updates concurrently
        await Promise.all(updatePromises);

        console.log("All applicants have been processed.");

    } catch (error) {
        console.error("Error processing exam results:", error);
    }
};

main();
