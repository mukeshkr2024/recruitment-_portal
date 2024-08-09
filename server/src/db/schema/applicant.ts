import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import crypto from "crypto";
import { position } from "./postition";
import { relations } from "drizzle-orm";

export const applicant = pgTable("applicant", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    firstName: varchar("first_name", { length: 255 }).notNull(),
    lastName: varchar("last_name", { length: 255 }).notNull(),
    email: varchar("email").notNull().unique(),
    appliedFor: text("applied_for").references(() => position.id),
    accessCode: varchar("access_code", { length: 255 }).notNull(),
    phone: varchar("contact_phone", { length: 255 }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
})

export const applicantRelations = relations(applicant, ({ one, many }) => ({
    appliedFor: one(position, {
        fields: [applicant.appliedFor],
        references: [position.id]
    })
}))