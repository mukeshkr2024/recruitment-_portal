CREATE TABLE IF NOT EXISTS "result" (
	"id" text PRIMARY KEY NOT NULL,
	"applicant_id" text NOT NULL,
	"applied_positon_id" text NOT NULL,
	"score" numeric NOT NULL,
	"total_scrole" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"overall_grade" varchar(5),
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "option" ALTER COLUMN "is_correct" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "result" ADD CONSTRAINT "result_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "result" ADD CONSTRAINT "result_applied_positon_id_position_id_fk" FOREIGN KEY ("applied_positon_id") REFERENCES "public"."position"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
