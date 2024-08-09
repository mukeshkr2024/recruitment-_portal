import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import crypto from "crypto";
import { relations } from "drizzle-orm";
import { position } from "./postition";

export const user = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    role: text("role",).notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("update_at").notNull().defaultNow(),
})

export const userRelations = relations(user, ({ one, many }) => ({
    positions: many(position)
}))