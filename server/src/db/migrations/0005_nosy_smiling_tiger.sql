DROP TABLE "result";--> statement-breakpoint
ALTER TABLE "exam_result" DROP CONSTRAINT "exam_result_exam_id_exam_id_fk";
--> statement-breakpoint
ALTER TABLE "position" DROP CONSTRAINT "position_created_by_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exam_result" ADD CONSTRAINT "exam_result_exam_id_exam_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exam"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "position" DROP COLUMN IF EXISTS "created_by";--> statement-breakpoint
ALTER TABLE "position" DROP COLUMN IF EXISTS "updated_at";