CREATE TABLE IF NOT EXISTS "fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"location" text NOT NULL,
	"area" numeric(100, 20) NOT NULL,
	"image_url" text NOT NULL,
	"image_key" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "plants" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "plants" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "fields" ADD CONSTRAINT "fields_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
