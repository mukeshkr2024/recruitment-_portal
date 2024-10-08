ALTER TABLE "submission" DROP CONSTRAINT "submission_position_id_position_id_fk";
--> statement-breakpoint
ALTER TABLE "exam_submission" ADD COLUMN "assessment_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_submission" ADD CONSTRAINT "exam_submission_assessment_id_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "submission" DROP COLUMN IF EXISTS "position_id";