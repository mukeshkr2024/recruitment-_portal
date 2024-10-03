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

        // Filter SELECTED applicants with fewer than 3 exam results
        const selectedApplicantsWithLessThanThreeExamResults = assessments
            .filter(({ applicant }) =>
                applicant.examResults?.length < 3 && applicant.status === "SELECTED" // Check for SELECTED status and examResults length
            )
            .map(({ applicant }) => ({
                name: `${applicant.firstName} ${applicant.lastName}`,
                email: applicant.email
            }));

        if (selectedApplicantsWithLessThanThreeExamResults.length === 0) {
            console.log("No selected applicants found with fewer than 3 exam results.");
        } else {
            console.log(selectedApplicantsWithLessThanThreeExamResults);
        }
    } catch (error) {
        console.error("Error processing exam results:", error);
    }
};

main();
