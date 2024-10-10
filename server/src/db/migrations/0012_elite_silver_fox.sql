ALTER TABLE "exam_submission" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "exam_submission" ADD COLUMN "exam_status" text DEFAULT 'PENDING' NOT NULL;