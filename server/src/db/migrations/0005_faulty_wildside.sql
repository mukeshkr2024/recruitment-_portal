ALTER TABLE "assesment" ADD COLUMN "status" text DEFAULT 'PENDING' NOT NULL;--> statement-breakpoint
ALTER TABLE "assesment" ADD COLUMN "score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "assesment" ADD COLUMN "total_score" integer DEFAULT 0 NOT NULL;