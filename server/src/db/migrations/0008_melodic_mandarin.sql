ALTER TABLE "applicant" ADD COLUMN "applied_for" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "applicant" ADD CONSTRAINT "applicant_applied_for_position_id_fk" FOREIGN KEY ("applied_for") REFERENCES "public"."position"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
