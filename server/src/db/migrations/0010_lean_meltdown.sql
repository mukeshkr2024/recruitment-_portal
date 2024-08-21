ALTER TABLE "exam_results" RENAME TO "exam_result";--> statement-breakpoint
ALTER TABLE "exam_result" DROP CONSTRAINT "exam_results_applicant_id_applicant_id_fk";
--> statement-breakpoint
ALTER TABLE "exam_result" DROP CONSTRAINT "exam_results_exam_id_exam_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
