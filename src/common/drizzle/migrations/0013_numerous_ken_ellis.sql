CREATE TABLE IF NOT EXISTS "planting_activities" (
	"id" serial PRIMARY KEY NOT NULL,
	"field_id" uuid NOT NULL,
	"plant_id" uuid NOT NULL,
	"harvest_estimate_date" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '3 MONTHS' NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"harvest_amount" integer,
	"harvested_at" timestamp
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "planting_activities" ADD CONSTRAINT "planting_activities_field_id_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."fields"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "planting_activities" ADD CONSTRAINT "planting_activities_plant_id_plants_id_fk" FOREIGN KEY ("plant_id") REFERENCES "public"."plants"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
