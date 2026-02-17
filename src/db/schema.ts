import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  integer,
  pgEnum,
  boolean,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const statusEnum = pgEnum('status', [
  'pending',
  'processing',
  'completed',
  'cancelled',
]);

export const cakes = pgTable(
  'cakes',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    description: text('description'),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    category: text('category').notNull(),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    categoryIdx: index('cakes_category_idx').on(table.category),
    nameIdx: index('cakes_name_idx').on(table.name),
    createdAtIdx: index('cakes_created_at_idx').on(table.createdAt),
  }),
);

export const orders = pgTable(
  'orders',
  {
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
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    cakeIdIdx: index('orders_cake_id_idx').on(table.cakeId),
    statusIdx: index('orders_status_idx').on(table.status),
    createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
    // Composite for common dashboard/filter queries
    statusCreatedIdx: index('orders_status_created_idx').on(
      table.status,
      table.createdAt,
    ),
  }),
);

export const cakesRelations = relations(cakes, ({ many }) => ({
  orders: many(orders),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  cake: one(cakes, { fields: [orders.cakeId], references: [cakes.id] }),
}));

export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    rating: integer('rating').notNull(),
    comment: text('comment').notNull(),
    avatar: text('avatar'),
    displayReview: boolean('display_review').default(true),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    ratingIdx: index('reviews_rating_idx').on(table.rating),
    displayReviewIdx: index('reviews_display_review_idx').on(
      table.displayReview,
    ),
    // For displaying newest approved reviews
    displayDateIdx: index('reviews_display_date_idx').on(
      table.displayReview,
      table.createdAt.desc(),
    ),
  }),
);

export const uploadedAssets = pgTable('uploaded_assets', {
  id: uuid('id').primaryKey().defaultRandom(),
  hash: text('hash').notNull().unique(),
  url: text('url').notNull(),
  publicId: text('public_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
