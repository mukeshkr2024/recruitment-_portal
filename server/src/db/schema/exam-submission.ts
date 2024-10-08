import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { exam } from "./exam";
import { relations } from "drizzle-orm";
import { submission } from "./submission";
import { applicant } from "./applicant";
import { assessment } from "./assesment";

export const examSubmission = pgTable("exam_submission", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    examId: text("exam_id").references(() => exam.id, { onDelete: "cascade" }),
    applicantId: text("applicant_id").references(() => applicant.id, {
        onDelete: "cascade"
    }).notNull(),
    status: text("status").default("PENDING"),
    assessmentId: text("assessment_id").references(() => assessment.id, {
        onDelete: "cascade"
    }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const examSubmissionRelations = relations(examSubmission, ({ one, many }) => ({
    exam: one(exam, {
        fields: [examSubmission.examId],
        references: [exam.id],
    }),
    answers: many(submission),
    applicant: one(applicant, {
        fields: [examSubmission.applicantId],
        references: [applicant.id],
    }),
    assessment: one(assessment, {
        fields: [examSubmission.assessmentId],
        references: [assessment.id],
    }),
}));
