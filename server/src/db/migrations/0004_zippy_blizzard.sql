CREATE TABLE IF NOT EXISTS "assesment" (
	"id" text PRIMARY KEY NOT NULL,
	"applicant_id" text NOT NULL,
	"position_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "applicant" DROP CONSTRAINT "applicant_applied_for_position_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assesment" ADD CONSTRAINT "assesment_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "assesment" ADD CONSTRAINT "assesment_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "applicant" DROP COLUMN IF EXISTS "applied_for";