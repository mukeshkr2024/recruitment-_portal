import db from "../src/db";
import { user, position, question, option } from "../src/db/schema";

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
                questionText: "How do you approach designing a user interface for a new product? - Question 1"
            },
            {
                positionId: positionId,
                questionText: "Can you describe a time when you had to balance user needs with business goals in your design? - Question 2"
            },
            {
                positionId: positionId,
                questionText: "What tools and methods do you use for user research and usability testing? - Question 3"
            },
            {
                positionId: positionId,
                questionText: "How do you ensure your designs are accessible to users with disabilities? - Question 4"
            },
            {
                positionId: positionId,
                questionText: "Can you give an example of how you’ve used feedback to iterate on a design? - Question 5"
            },
            {
                positionId: positionId,
                questionText: "What are some common UI/UX mistakes you’ve encountered, and how do you avoid them? - Question 6"
            }
        ]).returning()

        const questionIds = questions.map(q => q.id);

        const options = await db.insert(option).values([
            { questionId: questionIds[0], optionText: "Option 1 for question 1" },
            { questionId: questionIds[0], optionText: "Option 2 for question 1" },
            { questionId: questionIds[0], optionText: "Option 3 for question 1" },
            { questionId: questionIds[0], optionText: "Option 4 for question 1" },

            { questionId: questionIds[1], optionText: "Option 1 for question 2" },
            { questionId: questionIds[1], optionText: "Option 2 for question 2" },
            { questionId: questionIds[1], optionText: "Option 3 for question 2" },
            { questionId: questionIds[1], optionText: "Option 4 for question 2" },

            { questionId: questionIds[2], optionText: "Option 1 for question 3" },
            { questionId: questionIds[2], optionText: "Option 2 for question 3" },
            { questionId: questionIds[2], optionText: "Option 3 for question 3" },
            { questionId: questionIds[2], optionText: "Option 4 for question 3" },

            { questionId: questionIds[3], optionText: "Option 1 for question 4" },
            { questionId: questionIds[3], optionText: "Option 2 for question 4" },
            { questionId: questionIds[3], optionText: "Option 3 for question 4" },
            { questionId: questionIds[3], optionText: "Option 4 for question 4" },

            { questionId: questionIds[4], optionText: "Option 1 for question 5" },
            { questionId: questionIds[4], optionText: "Option 2 for question 5" },
            { questionId: questionIds[4], optionText: "Option 3 for question 5" },
            { questionId: questionIds[4], optionText: "Option 4 for question 5" },

            { questionId: questionIds[5], optionText: "Option 1 for question 6" },
            { questionId: questionIds[5], optionText: "Option 2 for question 6" },
            { questionId: questionIds[5], optionText: "Option 3 for question 6" },
            { questionId: questionIds[5], optionText: "Option 4 for question 6" }
        ])

        console.log(options);

        console.log(questions);

        console.log("Job Positions created:", jobPositions);
        console.log("Seeding finished...");
    } catch (error) {
        console.error("Error in seeding", error);
    }
}

seed();