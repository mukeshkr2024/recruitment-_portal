ALTER TABLE "exam_result" DROP CONSTRAINT "exam_result_assessment_id_assessment_id_fk";
--> statement-breakpoint
ALTER TABLE "exam_result" DROP COLUMN IF EXISTS "assessment_id";