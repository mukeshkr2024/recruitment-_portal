import db from "../src/db";
import { user } from "../src/db/schema";

const seed = async () => {
    try {
        console.log("Seeding started...");

        await db.delete(user)

        const created = await db.insert(user).values([{
            firstName: "Admin",
            lastName: "Cloudprism",
            email: "admin@cloudprism.in",
            password: "Cloudprism@24",
            role: "admin"
        }])

        console.log(created);
        console.log("Seeding finished...");

    } catch (error) {
        console.error("Error in seeding:", error);
    }
}

seed()