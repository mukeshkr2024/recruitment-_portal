import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import crypto from "crypto";

export const applicant = pgTable("applicant", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email").notNull().unique(),
    phone: varchar("contact_phone", { length: 255 }).notNull(),
    createAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
})

