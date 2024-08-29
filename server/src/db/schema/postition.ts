import crypto from "crypto";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { assessment } from "./assesment";

export const position = pgTable("position", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    positionName: text("position_name").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const positionRelations = relations(position, ({ many, one }) => ({
    assesment: many(assessment),
}));
