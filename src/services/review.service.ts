import { db } from '../db';
import { reviews } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const reviewSchema = z.object({
  name: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  date: z.string().pipe(z.coerce.date()),
  comment: z.string().min(10),
  avatar: z.string().url().optional(),
});

export const getAllReviews = async () => {
  return await db.select().from(reviews).orderBy(desc(reviews.date));
};

export const getReviewById = async (id: string) => {
  const result = await db
    .select()
    .from(reviews)
    .where(eq(reviews.id, id))
    .limit(1);
  return result[0] || null;
};

export const createReview = async (data: unknown) => {
  const validated = reviewSchema.parse(data);
  const [newReview] = await db.insert(reviews).values(validated).returning();
  return newReview;
};

export const updateReview = async (id: string, data: unknown) => {
  const validated = reviewSchema.partial().parse(data);
  const [updated] = await db
    .update(reviews)
    .set({ ...validated, updatedAt: new Date() })
    .where(eq(reviews.id, id))
    .returning();
  return updated || null;
};

export const deleteReview = async (id: string) => {
  const [deleted] = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning();
  return !!deleted;
};
