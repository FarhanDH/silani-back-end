import { relations, sql } from 'drizzle-orm';
import { date, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { aIChats } from './ai-chats';
import { fields } from './fields';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  dateOfBirth: date('date_of_birth'),
  avatarUrl: text('avatar_url').notNull(),
  googleId: text('google_id'),
  facebookId: text('facebook_id'),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type User = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  aIChats: many(aIChats),
  fields: many(fields),
}));
