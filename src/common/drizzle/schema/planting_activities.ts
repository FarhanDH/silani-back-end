import { relations, sql } from 'drizzle-orm';
import { bigint, pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { fields, plants } from './index';

export const plantingActivities = pgTable('planting_activities', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  fieldId: uuid('field_id')
    .references(() => fields.id, { onDelete: 'cascade' })
    .notNull(),
  plantId: uuid('plant_id')
    .references(() => plants.id, { onDelete: 'cascade' })
    .notNull(),
  harvestEstimateDate: timestamp('harvest_estimate_date')
    .default(sql`CURRENT_TIMESTAMP + INTERVAL '3 MONTHS'`)
    .notNull(),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  harvestAmount: bigint('harvest_amount', { mode: 'number' }),
  harvestedAt: timestamp('harvested_at'),
});

export type PlantingActivity = typeof plantingActivities.$inferSelect;

export const plantingActivitiesRelations = relations(
  plantingActivities,
  ({ one }) => ({
    field: one(fields, {
      fields: [plantingActivities.fieldId],
      references: [fields.id],
    }),
    plant: one(plants, {
      fields: [plantingActivities.plantId],
      references: [plants.id],
    }),
  }),
);
