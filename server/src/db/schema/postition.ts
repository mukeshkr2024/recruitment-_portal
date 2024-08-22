import crypto from "crypto";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { assessment } from "./assesment";
import { result } from "./result";
import { user } from "./user";

export const position = pgTable("position", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    positionName: text("position_name").notNull(),
    createdBy: text("created_by").references(() => user.id, {
        onDelete: "cascade"
    }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const positionRelations = relations(position, ({ many, one }) => ({
    user: one(user, {
        fields: [position.createdBy],
        references: [user.id],
    }),
    results: many(result),
    assesment: many(assessment),
}));
