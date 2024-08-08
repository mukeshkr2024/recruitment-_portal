import db from "../src/db";
import { user, position, question } from "../src/db/schema";

const seed = async () => {
    try {
        console.log("Seeding started...");

        await db.delete(position);
        await db.delete(user);
        await db.delete(question);

        // Create users 
        const userCreated = await db.insert(user).values([{
            firstName: "Mukesh",
            lastName: "Kumar",
            email: "mukesh@gmail.com",
            password: "hashedPassword",
            role: "admin",
        }]).returning();

        console.log(userCreated);

        const userId = userCreated[0].id;

        // Create job positions
        const jobPositions = await db.insert(position).values([
            { positionName: "UI/UX Designer", createdBy: userId },
            { positionName: "Software Engineer", createdBy: userId },
            { positionName: "Product Manager", createdBy: userId },
            { positionName: "Data Scientist", createdBy: userId },
            { positionName: "DevOps Engineer", createdBy: userId },
            { positionName: "Quality Assurance Engineer", createdBy: userId },
        ]).returning();

        const positionId = jobPositions[0].id

        const questions = await db.insert(question).values([
            {
                positionId: positionId,
                questionText: "How do you approach designing a user interface for a new product?"
            },
            {
                positionId: positionId,
                questionText: "Can you describe a time when you had to balance user needs with business goals in your design?"
            },
            {
                positionId: positionId,
                questionText: "What tools and methods do you use for user research and usability testing?"
            },
            {
                positionId: positionId,
                questionText: "How do you ensure your designs are accessible to users with disabilities?"
            },
            {
                positionId: positionId,
                questionText: "Can you give an example of how you’ve used feedback to iterate on a design?"
            },
            {
                positionId: positionId,
                questionText: "What are some common UI/UX mistakes you’ve encountered, and how do you avoid them?"
            }
        ]).returning()

        console.log(questions);


        console.log("Job Positions created:", jobPositions);
        console.log("Seeding finished...");
    } catch (error) {
        console.error("Error in seeding", error);
    }
}

seed();