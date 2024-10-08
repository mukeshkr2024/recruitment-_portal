import { relations } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { exam } from "./exam";

export const codingQuestion = pgTable("coding_question", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    examId: text("exam_id").references(() => exam.id, {
        onDelete: "cascade"
    }).notNull(),
    questionText: text("question_text").notNull(),
    questionCode: text("question_code"),
    haveQuestionCode: boolean("have_question_code"),
    language: text("language").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
})

export const codingQuestionRelations = relations(codingQuestion, ({ one }) => ({
    exam: one(exam, {
        fields: [codingQuestion.examId],
        references: [exam.id]
    })
}))