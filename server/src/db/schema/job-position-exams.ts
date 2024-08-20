import { pgTable, primaryKey, text } from "drizzle-orm/pg-core";
import { position } from "./postition";
import { exam } from "./exam";

export const jobPositionExams = pgTable("job_position_exams", {
    positionId: text("position_id").notNull().references(() => position.id),
    examId: text("exam_id").notNull().references(() => exam.id)
}, (table) => ({
    pk: primaryKey({ columns: [table.examId, table.positionId] })
})) 