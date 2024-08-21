CREATE TABLE IF NOT EXISTS "exam_results" (
	"id" text PRIMARY KEY NOT NULL,
	"applicant_id" text,
	"exam_id" text,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"score" integer DEFAULT 0 NOT NULL,
	"total_score" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicant" ALTER COLUMN "contact_phone" SET DATA TYPE varchar(15);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_results" ADD CONSTRAINT "exam_results_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
