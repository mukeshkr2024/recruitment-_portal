import { applicant } from "../src/db/schema";

const main = async () => {
    try {


        console.log("All applicants have been processed.");

    } catch (error) {
        console.error("Error processing exam results:", error);
    }
};

main();
