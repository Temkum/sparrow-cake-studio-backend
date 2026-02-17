import { db } from '../db';
import { reviews } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const reviewSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
  avatar: z
    .string()
    .url({ message: 'Must be a valid URL' })
    .optional()
    .default(
      'https://res.cloudinary.com/softechdev/image/upload/v1745058656/cakes/placeholder-1745058653495.svg',
    ),
});

export const getAllReviews = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const data = await db
    .select()
    .from(reviews)
    .orderBy(desc(reviews.createdAt))
    .limit(limit)
    .offset(offset);

  return data;
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
  if (!data || typeof data !== 'object') {
    throw Object.assign(new Error('Validation failed'), {
      status: 400,
      errors: { body: ['Request body must be an object'] },
    });
  }
  const validated = reviewSchema.safeParse(data);

  if (!validated.success) {
    throw Object.assign(new Error('Validation failed'), {
      status: 400,
      errors: validated.error.flatten().fieldErrors,
    });
  }

  try {
    const [newReview] = await db
      .insert(reviews)
      .values(validated.data)
      .returning();

    return newReview;
  } catch (err: any) {
    if (err.code === '23505') {
      // unique violation – if you ever add unique constraint
      throw new Error('Duplicate review detected');
    }
    throw err;
  }
};

export const updateReview = async (id: string, data: unknown) => {
  const validated = reviewSchema.partial().safeParse(data);
  if (!validated.success) {
    throw Object.assign(new Error('Validation failed'), {
      status: 400,
      errors: validated.error.flatten().fieldErrors,
    });
  }

  const [updated] = await db
    .update(reviews)
    .set({ ...validated.data, updatedAt: new Date() })
    .where(eq(reviews.id, id))
    .returning();

  if (!updated) return null;
  return updated;
};

export const deleteReview = async (id: string) => {
  const [deleted] = await db
    .delete(reviews)
    .where(eq(reviews.id, id))
    .returning();
  return !!deleted;
};
