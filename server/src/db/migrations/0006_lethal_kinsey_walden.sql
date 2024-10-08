DO $$ BEGIN
 CREATE TYPE "public"."exam_type" AS ENUM('mcq', 'coding');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
