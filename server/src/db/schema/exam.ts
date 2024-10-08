import { relations } from "drizzle-orm";
import { integer, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { question } from "./question";
import { examResult } from "./exam-result";
import { codingQuestion } from "./coding-questions";

export const examTypeEnum = pgEnum("exam_type", ["mcq", "coding"]);

export const exam = pgTable("exam", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    examType: examTypeEnum("exam_type").default("mcq").notNull(),
    duration: integer("duration").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const examRelations = relations(exam, ({ one, many }) => ({
    questions: many(question),
    codingQuestions: many(codingQuestion),
    examResults: many(examResult),
}));
