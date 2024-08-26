import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { applicant } from "./applicant";
import { exam } from "./exam";
import { relations } from "drizzle-orm";
import { assessment } from "./assesment";

export const examResult = pgTable("exam_result", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    applicantId: text("applicant_id").references(() => applicant.id, {
        onDelete: "cascade"
    }).notNull(),
    examId: text("exam_id").references(() => exam.id, {
        onDelete: "cascade"
    }).notNull(),
    assessmentId: text("assessment_id").references(() => assessment.id).notNull(),
    examStatus: text("exam_status").default("PENDING").notNull(),
    status: text("status").default("PENDING").notNull(),
    score: integer("score").default(0).notNull(),
    totalScore: integer("total_score").default(0).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const examResultsRelations = relations(examResult, ({ one, many }) => ({
    applicant: one(applicant, {
        fields: [examResult.applicantId],
        references: [applicant.id]
    }),
    exam: one(exam, {
        fields: [examResult.examId],
        references: [exam.id]
    }),
    assessment: one(assessment, {
        fields: [examResult.assessmentId],
        references: [assessment.id]
    }),
}))