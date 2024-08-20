CREATE TABLE IF NOT EXISTS "exam" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"duration" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "job_position_exams" (
	"position_id" text NOT NULL,
	"exam_id" text NOT NULL,
	CONSTRAINT "job_position_exams_exam_id_position_id_pk" PRIMARY KEY("exam_id","position_id")
);
--> statement-breakpoint
ALTER TABLE "question" DROP CONSTRAINT "question_position_id_position_id_fk";
--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "exam_id" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_position_exams" ADD CONSTRAINT "job_position_exams_position_id_position_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."position"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "job_position_exams" ADD CONSTRAINT "job_position_exams_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question" ADD CONSTRAINT "question_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "position" DROP COLUMN IF EXISTS "duration";--> statement-breakpoint
ALTER TABLE "question" DROP COLUMN IF EXISTS "position_id";