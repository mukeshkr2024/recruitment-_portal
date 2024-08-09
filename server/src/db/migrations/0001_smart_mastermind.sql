DROP TABLE "result";--> statement-breakpoint
ALTER TABLE "applicant" ADD COLUMN "score" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "applicant" ADD COLUMN "status" text DEFAULT 'pending';