ALTER TABLE "result" DROP CONSTRAINT "result_applicant_id_applicant_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "result" ADD CONSTRAINT "result_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
