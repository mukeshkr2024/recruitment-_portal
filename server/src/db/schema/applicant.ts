import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import crypto from "crypto";
import { relations } from "drizzle-orm";
import { assessment } from "./assesment";

export const applicant = pgTable("applicant", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    accessCode: varchar("access_code", { length: 255 }).notNull(),
    phone: varchar("contact_phone", { length: 15 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const applicantRelations = relations(applicant, ({ many }) => ({
    assements: many(assessment)
}));
