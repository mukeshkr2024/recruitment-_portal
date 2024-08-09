import db from "../src/db";
import { user, position, question, option, applicant, result } from "../src/db/schema";

const seed = async () => {
    try {
        console.log("Seeding started...");

        await db.delete(result);
        await db.delete(applicant);
        await db.delete(question);
        await db.delete(option);
        await db.delete(position);
        await db.delete(user);

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
            { questionId: questionIds[0], optionText: "Option 1 for question 1", isCorrect: true },
            { questionId: questionIds[0], optionText: "Option 2 for question 1", isCorrect: false },
            { questionId: questionIds[0], optionText: "Option 3 for question 1", isCorrect: false },
            { questionId: questionIds[0], optionText: "Option 4 for question 1", isCorrect: false },

            { questionId: questionIds[1], optionText: "Option 1 for question 2", isCorrect: true },
            { questionId: questionIds[1], optionText: "Option 2 for question 2", isCorrect: false },
            { questionId: questionIds[1], optionText: "Option 3 for question 2", isCorrect: false },
            { questionId: questionIds[1], optionText: "Option 4 for question 2", isCorrect: false },

            { questionId: questionIds[2], optionText: "Option 1 for question 3", isCorrect: true },
            { questionId: questionIds[2], optionText: "Option 2 for question 3", isCorrect: false },
            { questionId: questionIds[2], optionText: "Option 3 for question 3", isCorrect: false },
            { questionId: questionIds[2], optionText: "Option 4 for question 3", isCorrect: false },

            { questionId: questionIds[3], optionText: "Option 1 for question 4", isCorrect: true },
            { questionId: questionIds[3], optionText: "Option 2 for question 4", isCorrect: false },
            { questionId: questionIds[3], optionText: "Option 3 for question 4", isCorrect: false },
            { questionId: questionIds[3], optionText: "Option 4 for question 4", isCorrect: false },

            { questionId: questionIds[4], optionText: "Option 1 for question 5", isCorrect: true },
            { questionId: questionIds[4], optionText: "Option 2 for question 5", isCorrect: false },
            { questionId: questionIds[4], optionText: "Option 3 for question 5", isCorrect: false },
            { questionId: questionIds[4], optionText: "Option 4 for question 5", isCorrect: false },

            { questionId: questionIds[5], optionText: "Option 1 for question 6", isCorrect: true },
            { questionId: questionIds[5], optionText: "Option 2 for question 6", isCorrect: false },
            { questionId: questionIds[5], optionText: "Option 3 for question 6", isCorrect: false },
            { questionId: questionIds[5], optionText: "Option 4 for question 6", isCorrect: false }
        ])

        await db.insert(applicant).values([
            { firstName: "John", lastName: "Doe", email: "john@gmail.com", phone: "1234567890", accessCode: "3d33w223", appliedFor: positionId },
            { firstName: "Jane", lastName: "Smith", email: "jane@gmail.com", phone: "0987654321", accessCode: "4f44x334", appliedFor: positionId },
            { firstName: "Alice", lastName: "Johnson", email: "alice@gmail.com", phone: "1122334455", accessCode: "5g55y445", appliedFor: positionId },
            { firstName: "Bob", lastName: "Brown", email: "bob@gmail.com", phone: "2233445566", accessCode: "6h66z556", appliedFor: positionId },
            { firstName: "Charlie", lastName: "Davis", email: "charlie@gmail.com", phone: "3344556677", accessCode: "7i77a667", appliedFor: positionId },
            { firstName: "David", lastName: "Wilson", email: "david@gmail.com", phone: "4455667788", accessCode: "8j88b778", appliedFor: positionId },
            { firstName: "Eva", lastName: "Clark", email: "eva@gmail.com", phone: "5566778899", accessCode: "9k99c889", appliedFor: positionId },
            { firstName: "Frank", lastName: "Lewis", email: "frank@gmail.com", phone: "6677889900", accessCode: "0l00d990", appliedFor: positionId },
            { firstName: "Grace", lastName: "Walker", email: "grace@gmail.com", phone: "7788990011", accessCode: "1m11e001", appliedFor: positionId },
            { firstName: "Hank", lastName: "Hall", email: "hank@gmail.com", phone: "8899001122", accessCode: "2n22f112", appliedFor: positionId },
        ]);

        console.log(options);
        console.log(questions);

        console.log("Job Positions created:", jobPositions);
        console.log("Seeding finished...");
    } catch (error) {
        console.error("Error in seeding", error);
    }
}

seed();