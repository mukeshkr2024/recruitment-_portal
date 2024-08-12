import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import crypto from "crypto";
import { user } from "./user";
import { relations } from "drizzle-orm";
import { question } from "./question";
import { result } from "./result";

export const position = pgTable("position", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    positionName: text("position_name").notNull(),
    createdBy: text("created_by").references(() => user.id, {
        onDelete: "cascade"
    }).notNull(),
    duration: integer("duration").default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const positionRelations = relations(position, ({ many, one }) => ({
    user: one(user, {
        fields: [position.createdBy],
        references: [user.id],
    }),
    questions: many(question),
    results: many(result),
}));
