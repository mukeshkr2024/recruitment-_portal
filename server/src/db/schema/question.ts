import { pgTable, text } from "drizzle-orm/pg-core";
import { position } from "./postition";
import { relations } from "drizzle-orm";
import { option } from "./option";

export const question = pgTable("question", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    positionId: text("position_id").references(() => position.id, {
        onDelete: "cascade"
    }).notNull(),
    questionText: text("question_text").notNull(),
});

export const questionRelations = relations(question, ({ one, many }) => ({
    position: one(position, {
        fields: [question.positionId],
        references: [position.id]
    }),
    options: many(option)
}));