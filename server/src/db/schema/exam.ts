import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { question } from "./question";

export const exam = pgTable("exam", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    duration: integer("duration").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
})

export const examRelations = relations(exam, ({ one, many }) => ({
    questions: many(question)
}))