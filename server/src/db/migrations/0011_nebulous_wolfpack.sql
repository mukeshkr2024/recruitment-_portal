ALTER TABLE "submission" DROP CONSTRAINT "submission_question_id_question_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_question_id_coding_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."coding_question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
