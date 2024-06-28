import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';

export const aIChats = pgTable('ai_chats', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  prompt: text('prompt').notNull(),
  response: text('response').notNull(),
  imageUrl: text('image_url'),
  imageKey: text('image_key'),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type AiChat = typeof aIChats.$inferSelect;

export const aIChatsRelations = relations(aIChats, ({ one }) => ({
  user: one(users, { fields: [aIChats.userId], references: [users.id] }),
}));
