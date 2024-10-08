CREATE TABLE IF NOT EXISTS "exam_submission" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_id" text,
	"applicant_id" text NOT NULL,
	"status" text DEFAULT 'PENDING',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submission" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_id" text,
	"applicant_id" text NOT NULL,
	"question_id" text,
	"position_id" text,
	"submitted_answer" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_submission" ADD CONSTRAINT "exam_submission_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_submission" ADD CONSTRAINT "exam_submission_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_applicant_id_applicant_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."applicant"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission" ADD CONSTRAINT "submission_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
