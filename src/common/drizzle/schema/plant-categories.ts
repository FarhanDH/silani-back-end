import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { plants } from './plants';

export const plantCategories = pgTable('plant-categories', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type PlantCategory = typeof plantCategories.$inferSelect;

export const plantCategoriesRelations = relations(
  plantCategories,
  ({ many }) => ({
    plants: many(plants),
  }),
);
