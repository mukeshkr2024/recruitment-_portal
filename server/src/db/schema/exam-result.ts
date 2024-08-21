import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { applicant } from "./applicant";
import { exam } from "./exam";
import { relations } from "drizzle-orm";

export const examResult = pgTable("exam_result", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    applicantId: text("applicant_id").references(() => applicant.id),
    examId: text("exam_id").references(() => exam.id),
    status: text("status").default("PENDING").notNull(),
    score: integer("score").default(0).notNull(),
    totalScore: integer("total_score").default(0).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const examResultsRelations = relations(examResult, ({ one, many }) => ({
    applicant: one(applicant, {
        fields: [examResult.applicantId],
        references: [applicant.id]
    }),
    exam: one(exam, {
        fields: [examResult.examId],
        references: [exam.id]
    }),
}))