import { relations, sql } from 'drizzle-orm';
import { decimal, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { fieldPests } from './field_pests';

export const fields = pgTable('fields', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  location: text('location').notNull(),
  area: decimal('area', { precision: 100, scale: 20 }).notNull(),
  imageUrl: text('image_url').notNull(),
  imageKey: text('image_key').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type Field = typeof fields.$inferSelect;

export const fieldsRelations = relations(fields, ({ one, many }) => ({
  user: one(users, { fields: [fields.userId], references: [users.id] }),
  fieldPest: many(fieldPests),
}));
