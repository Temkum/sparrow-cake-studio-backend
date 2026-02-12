import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  integer,
  serial,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const statusEnum = pgEnum('status', [
  'pending',
  'processing',
  'completed',
  'cancelled',
]);

export const cakes = pgTable('cakes', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  customer: text('customer').notNull(),
  phone: text('phone').notNull(),
  address: text('address').notNull(),
  cakeId: uuid('cake_id')
    .references(() => cakes.id)
    .notNull(),
  quantity: integer('quantity').notNull().default(1),
  status: statusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const cakesRelations = relations(cakes, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  cake: one(cakes, { fields: [orders.cakeId], references: [cakes.id] }),
}));
