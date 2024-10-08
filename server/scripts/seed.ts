import db from "../src/db";
import { user } from "../src/db/schema";

const main = async () => {
    console.log("Starting database seed...");
    try {
        // Delete all existing users
        await db.delete(user).execute();

        // Create a new user
        const createdUser = await db.insert(user).values({
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            password: "password123",
            role: "user"
        }).returning();

        console.log("Created User:", createdUser);
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

main();
