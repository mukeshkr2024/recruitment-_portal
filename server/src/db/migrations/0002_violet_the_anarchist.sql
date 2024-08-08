ALTER TABLE "position" DROP CONSTRAINT "position_created_by_user_id_fk";
--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "position_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "position" ADD CONSTRAINT "position_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
