DROP TABLE "plant_categories";--> statement-breakpoint
ALTER TABLE "pests" ADD COLUMN "image_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "pests" ADD COLUMN "image_key" text NOT NULL;