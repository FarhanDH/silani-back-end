import { sql } from 'drizzle-orm';
import { date, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  fullName: text('full_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  dateOfBirth: date('date_of_birth'),
  googleId: text('google_id'),
  facebookId: text('facebook_id'),
  avatarUrl: text('avatar_url').notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type User = typeof users.$inferSelect;
