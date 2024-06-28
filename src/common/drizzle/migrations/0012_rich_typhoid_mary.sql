ALTER TABLE "plant-categories" RENAME TO "plant_categories";--> statement-breakpoint
ALTER TABLE "plant_categories" DROP CONSTRAINT "plant-categories_name_unique";--> statement-breakpoint
ALTER TABLE "plants" DROP CONSTRAINT "plants_plant_category_id_plant-categories_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "plants" ADD CONSTRAINT "plants_plant_category_id_plant_categories_id_fk" FOREIGN KEY ("plant_category_id") REFERENCES "public"."plant_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "plant_categories" ADD CONSTRAINT "plant_categories_name_unique" UNIQUE("name");