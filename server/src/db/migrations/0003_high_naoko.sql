ALTER TABLE "option" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "option" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;