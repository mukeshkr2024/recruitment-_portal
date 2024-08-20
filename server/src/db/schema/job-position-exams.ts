import { relations } from "drizzle-orm";
import { boolean, pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { exam } from "./exam";
import { position } from "./postition";

export const jobPositionExams = pgTable("job_position_exams", {
    positionId: text("position_id").notNull().references(() => position.id),
    examId: text("exam_id").notNull().references(() => exam.id),
    isActive: boolean("is_active").notNull().default(true)
}, (table) => ({
    pk: primaryKey({ columns: [table.examId, table.positionId] })
}))


export const jobPositionExamsRelation = relations(jobPositionExams, ({ many, one }) => ({
    exam: one(exam, {
        fields: [jobPositionExams.examId],
        references: [exam.id]
    })
}))