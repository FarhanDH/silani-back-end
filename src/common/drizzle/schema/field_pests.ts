import { relations, sql } from 'drizzle-orm';
import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { pests } from './pests';
import { fields } from './fields';

export const fieldPests = pgTable('field_pests', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  pestId: uuid('pest_id')
    .notNull()
    .references(() => pests.id, { onDelete: 'cascade' }),
  fieldId: uuid('field_id')
    .notNull()
    .references(() => fields.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp('updated_at')
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export type FieldPest = typeof fieldPests.$inferSelect;

export const fieldPestsRelations = relations(fieldPests, ({ one }) => ({
  pest: one(pests, { fields: [fieldPests.pestId], references: [pests.id] }),
  field: one(fields, { fields: [fieldPests.fieldId], references: [fields.id] }),
}));
