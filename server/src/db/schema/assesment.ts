import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { applicant } from "./applicant";
import { position } from "./postition";

export const assessment = pgTable("assessment", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    applicantId: text("applicant_id").references(() => applicant.id, {
        onDelete: "cascade"
    }).notNull(),
    positionId: text("position_id").references(() => position.id, {
        onDelete: "cascade"
    }).notNull(),
    status: text("status").default("PENDING").notNull(),
    score: integer("score").default(0).notNull(),
    totalScore: integer("total_score").default(0).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})

export const assementRelations = relations(assessment, ({ one, many }) => ({
    applicant: one(applicant, {
        fields: [assessment.applicantId],
        references: [applicant.id]
    }),
    position: one(position, {
        fields: [assessment.positionId],
        references: [position.id]
    }),
}))