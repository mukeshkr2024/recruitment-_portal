ALTER TABLE "assessment" DROP CONSTRAINT "assessment_position_id_position_id_fk";
--> statement-breakpoint
ALTER TABLE "exam_result" DROP CONSTRAINT "exam_result_applicant_id_applicant_id_fk";
--> statement-breakpoint
ALTER TABLE "job_position_exams" DROP CONSTRAINT "job_position_exams_position_id_position_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assessment" ADD CONSTRAINT "assessment_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_assessment_id_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_position_exams" ADD CONSTRAINT "job_position_exams_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
