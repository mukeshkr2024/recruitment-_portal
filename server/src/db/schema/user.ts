import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import crypto from "crypto";

export const user = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role",).notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("update_at").notNull().defaultNow(),
})