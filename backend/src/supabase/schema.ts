import { pgTable, text, timestamp, uuid, varchar, numeric, date } from 'drizzle-orm/pg-core';

export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  brand: varchar('brand', { length: 255 }).notNull(),
  start_date: date('start_date').notNull(),
  end_date: date('end_date').notNull(),
  budget: numeric('budget').notNull(),
  image_url: text('image_url'),
  description: text('description'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;