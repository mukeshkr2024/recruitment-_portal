import { pgTable, text } from "drizzle-orm/pg-core";
import { exam } from "./exam";
import { applicant } from "./applicant";
import { question } from "./question";
import { relations } from "drizzle-orm";
import { codingQuestion } from "./coding-questions";
import { examSubmission } from "./exam-submission";

export const submission = pgTable("submission", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    examId: text("exam_id").references(() => exam.id, {
        onDelete: "cascade"
    }),
    applicantId: text("applicant_id").references(() => applicant.id, {
        onDelete: "cascade"
    }).notNull(),
    codingQuestionId: text("question_id").references(() => codingQuestion.id, {
        onDelete: "cascade"
    }).notNull(),
    submissionId: text("submission_id").references(() => examSubmission.id),
    submittedAnswer: text("submitted_answer")
});

export const submissionRelations = relations(submission, ({ many, one }) => ({
    exam: one(exam, {
        fields: [submission.examId],
        references: [exam.id]
    }),
    applicant: one(applicant, {
        fields: [submission.applicantId],
        references: [applicant.id]
    }),
    question: one(codingQuestion, {
        fields: [submission.codingQuestionId],
        references: [codingQuestion.id]
    }),
    examSubmission: one(examSubmission, {
        fields: [submission.submissionId],
        references: [examSubmission.id]
    })
}));
