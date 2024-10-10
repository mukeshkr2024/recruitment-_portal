ALTER TABLE "submission" ADD COLUMN "submission_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_submission_id_exam_submission_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."exam_submission"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
