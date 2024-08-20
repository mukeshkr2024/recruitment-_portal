import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { exam } from "./exam";
import { option } from "./option";

export const question = pgTable("question", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    examId: text("exam_id").references(() => exam.id, {
        onDelete: "cascade"
    }).notNull(),
    questionText: text("question_text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const questionRelations = relations(question, ({ one, many }) => ({
    exam: one(exam, {
        fields: [question.examId],
        references: [exam.id]
    }),
    options: many(option)
}));