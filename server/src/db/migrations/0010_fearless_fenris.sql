ALTER TABLE "exam_submission" DROP CONSTRAINT "exam_submission_applicant_id_applicant_id_fk";
--> statement-breakpoint
ALTER TABLE "exam_submission" DROP CONSTRAINT "exam_submission_assessment_id_assessment_id_fk";
--> statement-breakpoint
ALTER TABLE "submission" DROP CONSTRAINT "submission_applicant_id_applicant_id_fk";
--> statement-breakpoint
ALTER TABLE "submission" DROP CONSTRAINT "submission_question_id_question_id_fk";
--> statement-breakpoint
ALTER TABLE "submission" ALTER COLUMN "question_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_submission" ADD CONSTRAINT "exam_submission_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_submission" ADD CONSTRAINT "exam_submission_assessment_id_assessment_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessment"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
