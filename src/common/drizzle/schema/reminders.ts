import { relations, sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { plantingActivities } from './planting_activities';

export const reminders = pgTable('reminders', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  plantingActivitiesId: uuid('planting_activities_id')
    .references(() => plantingActivities.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  dateRemind: timestamp('date_remind').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Reminder = typeof reminders.$inferSelect;

export const remindersRelations = relations(reminders, ({ one }) => ({
  plantingActivity: one(plantingActivities, {
    fields: [reminders.plantingActivitiesId],
    references: [plantingActivities.id],
  }),
}));
