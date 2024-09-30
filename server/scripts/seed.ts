import { eq } from "drizzle-orm";
import db from "../src/db";
import { assessment } from "../src/db/schema";

const main = async () => {
    try {
        const positionId = "eeeffd6f-7269-41e8-9343-f311397ef4f4"; // Fixed typo in variable name

        const assessments = await db.query.assessment.findMany({
            where: eq(assessment.positionId, positionId), // Use corrected variable name
            with: {
                applicant: {
                    with: {
                        examResults: true
                    }
                }
            }
        });

        // Filter applicants with only one exam result
        const applicantsWithOneExamResult = assessments
            .filter(({ applicant }) => applicant.examResults.length === 1) // Destructure applicant for clarity
            .map(({ applicant }) => ({
                name: `${applicant.firstName} ${applicant.lastName}`,
                email: applicant.email
            }));

        if (applicantsWithOneExamResult.length === 0) {
            console.log("No applicants found with only one exam result.");
        } else {
            console.log(applicantsWithOneExamResult);
        }
    } catch (error) {
        console.error("Error processing exam results:", error);
    }
};

main();
