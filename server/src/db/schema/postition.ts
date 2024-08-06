import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user";
import { question } from "./question";

export const position = pgTable("position", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    positionName: text("position_name").notNull(),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const positionRelatios = relations(position, ({ many, one }) => ({
    user: one(user, {
        fields: [position.createdBy],
        references: [user.id]
    }),
    questions: many(question)
}))