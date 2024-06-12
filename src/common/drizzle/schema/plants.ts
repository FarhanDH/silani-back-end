import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { plantCategories } from './plant-categories';

export const plants = pgTable('plants', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
  plantCategoryId: uuid('plant_category_id')
    .notNull()
    .references(() => plantCategories.id, { onDelete: 'cascade' }),
  imageUrl: text('image_url').notNull(),
  imageKey: text('image_key').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Plant = typeof plants.$inferSelect;

export const plantsRelations = relations(plants, ({ one }) => ({
  plantCategory: one(plantCategories, {
    fields: [plants.plantCategoryId],
    references: [plantCategories.id],
  }),
}));
