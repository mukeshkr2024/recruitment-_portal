import { integer, numeric, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { applicant } from "./applicant";
import { position } from "./postition";
import { relations } from "drizzle-orm";

export const result = pgTable("result", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    applicantId: text("applicant_id").references(() => applicant.id).notNull(),
    appliedPositonId: text("applied_positon_id").references(() => position.id).notNull(),
    score: integer("score").notNull(),
    totalScore: integer("total_scrole").notNull(),
    createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
    overallGrade: varchar("overall_grade", { length: 5 }),
    updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
})

export const resultRelations = relations(result, ({ one }) => ({
    applicant: one(applicant, {
        fields: [result.applicantId],
        references: [applicant.id]
    }),
    position: one(position, {
        fields: [result.appliedPositonId],
        references: [position.id]
    })
}))