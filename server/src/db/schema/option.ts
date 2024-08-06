import { relations } from "drizzle-orm";
import { pgTable, text } from "drizzle-orm/pg-core";
import { question } from "./question";

export const option = pgTable("option", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    questionId: text("question_id").references(() => question.id, {
        onDelete: "cascade"
    }),
    optionText: text("option_text").notNull()
});


export const optionRelations = relations(option, ({ one }) => ({
    question: one(question, {
        fields: [option.questionId],
        references: [question.id]
    })
}));
