ALTER TABLE "exam_result" ALTER COLUMN "applicant_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exam_result" ALTER COLUMN "exam_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exam_result" ADD COLUMN "assessment_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_assessment_id_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
