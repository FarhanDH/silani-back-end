import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { fieldPests } from './field_pests';

export const pests = pgTable('pests', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().unique(),
  imageUrl: text('image_url').notNull(),
  imageKey: text('image_key').notNull(),
  createdAt: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export type Pest = typeof pests.$inferSelect;

export const pestsRelations = relations(pests, ({ many }) => ({
  fieldPests: many(fieldPests),
}));
