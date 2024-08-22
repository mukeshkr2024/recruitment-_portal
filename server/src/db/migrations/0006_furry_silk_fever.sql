ALTER TABLE "job_position_exams" DROP CONSTRAINT "job_position_exams_exam_id_exam_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_position_exams" ADD CONSTRAINT "job_position_exams_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
