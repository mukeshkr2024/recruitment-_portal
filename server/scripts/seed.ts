import db from "../src/db";
import { user, position, question, option, applicant, result, assessment, exam, jobPositionExams } from "../src/db/schema";

const seed = async () => {
    try {
        console.log("Seeding started...");

        // Clear existing data
        const tables = [assessment, result, applicant, question, option, position, user, jobPositionExams, exam];
        for (const table of tables) {
            try {
                await db.delete(table);
                console.log(`Cleared data from ${table}`);
            } catch (error) {
                console.error(`Error deleting from ${table}:`, error);
            }
        }

        const userCreated = await db.insert(user).values([{
            firstName: "Mukesh",
            lastName: "Kumar",
            email: "admin@gmail.com",
            password: "password",
            role: "admin",
        }]).returning();

        if (userCreated.length === 0) {
            throw new Error("Failed to create user");
        }

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

        if (jobPositions.length === 0) {
            throw new Error("Failed to create job positions");
        }

        const positionIds = jobPositions.map(p => p.id);

        const exams = await db.insert(exam).values([{
            name: "exam1",
            duration: 10
        }, {
            name: "exam2",
            duration: 15
        }, {
            name: "exam3",
            duration: 20,
        }]).returning()

        const examIds = exams.map(exam => exam.id);

        // Create questions
        const questions = await db.insert(question).values([
            { examId: examIds[0], questionText: "How do you prioritize user needs when designing a new product?" },
            { examId: examIds[0], questionText: "Describe a challenging project where you had to align user experience with business objectives. How did you handle it?" },
            { examId: examIds[0], questionText: "Which user research techniques do you find most effective, and how do you apply them in your design process?" },
            { examId: examIds[0], questionText: "What steps do you take to ensure your designs are accessible to users with disabilities?" },
            { examId: examIds[0], questionText: "Provide an example where feedback significantly changed your design approach. What was the outcome?" },
            { examId: examIds[1], questionText: "What are some common UI/UX design pitfalls you've encountered, and how do you avoid them?" },
            { examId: examIds[1], questionText: "How do you prioritize user needs when designing a new product?" },
            { examId: examIds[1], questionText: "Describe a challenging project where you had to align user experience with business objectives. How did you handle it?" },
            { examId: examIds[1], questionText: "Which user research techniques do you find most effective, and how do you apply them in your design process?" },
            { examId: examIds[1], questionText: "What steps do you take to ensure your designs are accessible to users with disabilities?" },
            { examId: examIds[1], questionText: "Provide an example where feedback significantly changed your design approach. What was the outcome?" },
            { examId: examIds[1], questionText: "What are some common UI/UX design pitfalls you've encountered, and how do you avoid them?" },
            { examId: examIds[2], questionText: "How do you prioritize user needs when designing a new product?" },
            { examId: examIds[2], questionText: "Describe a challenging project where you had to align user experience with business objectives. How did you handle it?" },
            { examId: examIds[2], questionText: "Which user research techniques do you find most effective, and how do you apply them in your design process?" },
            { examId: examIds[2], questionText: "What steps do you take to ensure your designs are accessible to users with disabilities?" },
            { examId: examIds[2], questionText: "Provide an example where feedback significantly changed your design approach. What was the outcome?" },
            { examId: examIds[2], questionText: "What are some common UI/UX design pitfalls you've encountered, and how do you avoid them?" }
        ]).returning();

        if (questions.length === 0) {
            throw new Error("Failed to create questions");
        }

        const questionIds = questions.map(q => q.id);

        // Create options
        await db.insert(option).values([
            // Options for examId: examIds[0]
            { questionId: questionIds[0], optionText: "Conduct user interviews and analyze user feedback", isCorrect: true },
            { questionId: questionIds[0], optionText: "Follow industry design trends", isCorrect: false },
            { questionId: questionIds[0], optionText: "Use a one-size-fits-all design approach", isCorrect: false },
            { questionId: questionIds[0], optionText: "Prioritize business goals over user needs", isCorrect: false },

            { questionId: questionIds[1], optionText: "Used A/B testing to refine user interactions", isCorrect: true },
            { questionId: questionIds[1], optionText: "Focused on the most expensive features", isCorrect: false },
            { questionId: questionIds[1], optionText: "Implemented designs based on personal preference", isCorrect: false },
            { questionId: questionIds[1], optionText: "Avoided user feedback to expedite the project", isCorrect: false },

            { questionId: questionIds[2], optionText: "Conducting user surveys and usability tests", isCorrect: true },
            { questionId: questionIds[2], optionText: "Relying on team opinions", isCorrect: false },
            { questionId: questionIds[2], optionText: "Following best practices without validation", isCorrect: false },
            { questionId: questionIds[2], optionText: "Using analytics tools exclusively", isCorrect: false },

            { questionId: questionIds[3], optionText: "Apply WCAG (Web Content Accessibility Guidelines) standards", isCorrect: true },
            { questionId: questionIds[3], optionText: "Design for aesthetics only", isCorrect: false },
            { questionId: questionIds[3], optionText: "Ensure design fits all screens without testing", isCorrect: false },
            { questionId: questionIds[3], optionText: "Limit font sizes and colors for simplicity", isCorrect: false },

            { questionId: questionIds[4], optionText: "Iterated based on user feedback leading to a more user-friendly interface", isCorrect: true },
            { questionId: questionIds[4], optionText: "Kept initial design despite user feedback", isCorrect: false },
            { questionId: questionIds[4], optionText: "Implemented feedback without assessing impact", isCorrect: false },
            { questionId: questionIds[4], optionText: "Focused on personal opinions rather than user needs", isCorrect: false },

            { questionId: questionIds[5], optionText: "Overloading the user interface with information", isCorrect: true },
            { questionId: questionIds[5], optionText: "Using consistent UI patterns", isCorrect: false },
            { questionId: questionIds[5], optionText: "Adhering to responsive design principles", isCorrect: false },
            { questionId: questionIds[5], optionText: "Applying user-centered design principles", isCorrect: false },

            // Options for examId: examIds[1] (repeating same questions with different options)
            { questionId: questionIds[6], optionText: "Conduct user interviews and analyze user feedback", isCorrect: true },
            { questionId: questionIds[6], optionText: "Follow industry design trends", isCorrect: false },
            { questionId: questionIds[6], optionText: "Use a one-size-fits-all design approach", isCorrect: false },
            { questionId: questionIds[6], optionText: "Prioritize business goals over user needs", isCorrect: false },

            { questionId: questionIds[7], optionText: "Used A/B testing to refine user interactions", isCorrect: true },
            { questionId: questionIds[7], optionText: "Focused on the most expensive features", isCorrect: false },
            { questionId: questionIds[7], optionText: "Implemented designs based on personal preference", isCorrect: false },
            { questionId: questionIds[7], optionText: "Avoided user feedback to expedite the project", isCorrect: false },

            { questionId: questionIds[8], optionText: "Conducting user surveys and usability tests", isCorrect: true },
            { questionId: questionIds[8], optionText: "Relying on team opinions", isCorrect: false },
            { questionId: questionIds[8], optionText: "Following best practices without validation", isCorrect: false },
            { questionId: questionIds[8], optionText: "Using analytics tools exclusively", isCorrect: false },

            { questionId: questionIds[9], optionText: "Apply WCAG (Web Content Accessibility Guidelines) standards", isCorrect: true },
            { questionId: questionIds[9], optionText: "Design for aesthetics only", isCorrect: false },
            { questionId: questionIds[9], optionText: "Ensure design fits all screens without testing", isCorrect: false },
            { questionId: questionIds[9], optionText: "Limit font sizes and colors for simplicity", isCorrect: false },

            { questionId: questionIds[10], optionText: "Iterated based on user feedback leading to a more user-friendly interface", isCorrect: true },
            { questionId: questionIds[10], optionText: "Kept initial design despite user feedback", isCorrect: false },
            { questionId: questionIds[10], optionText: "Implemented feedback without assessing impact", isCorrect: false },
            { questionId: questionIds[10], optionText: "Focused on personal opinions rather than user needs", isCorrect: false },

            { questionId: questionIds[11], optionText: "Overloading the user interface with information", isCorrect: true },
            { questionId: questionIds[11], optionText: "Using consistent UI patterns", isCorrect: false },
            { questionId: questionIds[11], optionText: "Adhering to responsive design principles", isCorrect: false },
            { questionId: questionIds[11], optionText: "Applying user-centered design principles", isCorrect: false },

            // Options for examId: examIds[2] (same questions as above with different options)
            { questionId: questionIds[12], optionText: "Conduct user interviews and analyze user feedback", isCorrect: true },
            { questionId: questionIds[12], optionText: "Follow industry design trends", isCorrect: false },
            { questionId: questionIds[12], optionText: "Use a one-size-fits-all design approach", isCorrect: false },
            { questionId: questionIds[12], optionText: "Prioritize business goals over user needs", isCorrect: false },

            { questionId: questionIds[13], optionText: "Used A/B testing to refine user interactions", isCorrect: true },
            { questionId: questionIds[13], optionText: "Focused on the most expensive features", isCorrect: false },
            { questionId: questionIds[13], optionText: "Implemented designs based on personal preference", isCorrect: false },
            { questionId: questionIds[13], optionText: "Avoided user feedback to expedite the project", isCorrect: false },

            { questionId: questionIds[14], optionText: "Conducting user surveys and usability tests", isCorrect: true },
            { questionId: questionIds[14], optionText: "Relying on team opinions", isCorrect: false },
            { questionId: questionIds[14], optionText: "Following best practices without validation", isCorrect: false },
            { questionId: questionIds[14], optionText: "Using analytics tools exclusively", isCorrect: false },

            { questionId: questionIds[15], optionText: "Apply WCAG (Web Content Accessibility Guidelines) standards", isCorrect: true },
            { questionId: questionIds[15], optionText: "Design for aesthetics only", isCorrect: false },
            { questionId: questionIds[15], optionText: "Ensure design fits all screens without testing", isCorrect: false },
            { questionId: questionIds[15], optionText: "Limit font sizes and colors for simplicity", isCorrect: false },

            { questionId: questionIds[16], optionText: "Iterated based on user feedback leading to a more user-friendly interface", isCorrect: true },
            { questionId: questionIds[16], optionText: "Kept initial design despite user feedback", isCorrect: false },
            { questionId: questionIds[16], optionText: "Implemented feedback without assessing impact", isCorrect: false },
            { questionId: questionIds[16], optionText: "Focused on personal opinions rather than user needs", isCorrect: false },

            { questionId: questionIds[17], optionText: "Overloading the user interface with information", isCorrect: true },
            { questionId: questionIds[17], optionText: "Using consistent UI patterns", isCorrect: false },
            { questionId: questionIds[17], optionText: "Adhering to responsive design principles", isCorrect: false },
            { questionId: questionIds[17], optionText: "Applying user-centered design principles", isCorrect: false }
        ]);
        // Create applicants
        const applicants = await db.insert(applicant).values([
            { firstName: "John", lastName: "Doe", email: "applicant@gmail.com", phone: "1234567890", accessCode: "password" },
            { firstName: "Jane", lastName: "Smith", email: "jane@gmail.com", phone: "0987654321", accessCode: "4f44x334" },
            { firstName: "Alice", lastName: "Johnson", email: "alice@gmail.com", phone: "1122334455", accessCode: "5g55y445" },
            { firstName: "Bob", lastName: "Brown", email: "bob@gmail.com", phone: "2233445566", accessCode: "6h66z556" },
            { firstName: "Charlie", lastName: "Davis", email: "charlie@gmail.com", phone: "3344556677", accessCode: "7i77a667" },
            { firstName: "David", lastName: "Wilson", email: "david@gmail.com", phone: "4455667788", accessCode: "8j88b778" },
            { firstName: "Eva", lastName: "Clark", email: "eva@gmail.com", phone: "5566778899", accessCode: "9k99c889" },
            { firstName: "Frank", lastName: "Lewis", email: "frank@gmail.com", phone: "6677889900", accessCode: "0l00d990" },
            { firstName: "Grace", lastName: "Walker", email: "grace@gmail.com", phone: "7788990011", accessCode: "1m11e001" },
            { firstName: "Hank", lastName: "Hall", email: "hank@gmail.com", phone: "8899001122", accessCode: "2n22f112" }
        ]).returning();


        // create job position exams 
        const jobPositionExamsResult = await db.insert(jobPositionExams).values([
            {
                positionId: positionIds[0],
                examId: examIds[1],
            }, {
                positionId: positionIds[0],
                examId: examIds[2],
            },
            {
                positionId: positionIds[1],
                examId: examIds[1],
            }, {
                positionId: positionIds[1],
                examId: examIds[2],
            }
        ])

        // // Create assessments
        await db.insert(assessment).values([
            { positionId: positionIds[0], applicantId: applicants[0].id },
            { positionId: positionIds[1], applicantId: applicants[0].id, status: "COMPLETED" },
            {
                positionId: positionIds[0],
                applicantId: applicants[1].id
            }, {
                positionId: positionIds[0],
                applicantId: applicants[2].id
            }, {
                positionId: positionIds[1],
                applicantId: applicants[3].id
            }, {
                positionId: positionIds[1],
                applicantId: applicants[4].id
            }, {
                positionId: positionIds[2],
                applicantId: applicants[5].id
            }, {
                positionId: positionIds[2],
                applicantId: applicants[6].id
            }, {
                positionId: positionIds[3],
                applicantId: applicants[7].id
            }, {
                positionId: positionIds[3],
                applicantId: applicants[8].id
            }, {
                positionId: positionIds[4],
                applicantId: applicants[9].id
            }

        ]);

        console.log("Job Positions created:", jobPositions);
        console.log("Questions created:", questions);
        console.log("Applicants created:", applicants);
        console.log("Assessments created successfully.");

        console.log("Seeding finished...");
    } catch (error) {
        console.error("Error in seeding:", error);
    }
}

seed();
