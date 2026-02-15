import { db } from '../db';
import { cakes } from '../db/schema';
import { eq, count } from 'drizzle-orm';
import { z } from 'zod';

const cakeSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/), // string for numeric precision
  category: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const getAllCakes = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const data = await db.select().from(cakes).limit(limit).offset(offset).all();
  const total = await db.select({ count: count() }).from(cakes).all();
  return { data, total: total[0].count, page, limit };
};

export const getCakeById = async (id: string) => {
  const result = await db.select().from(cakes).where(eq(cakes.id, id)).limit(1);
  return result[0] || null;
};

export const createCake = async (data: unknown) => {
  const validated = cakeSchema.parse(data);
  const [newCake] = await db.insert(cakes).values(validated).returning();
  return newCake;
};

export const updateCake = async (id: string, data: unknown) => {
  const validated = cakeSchema.partial().parse(data);
  const [updated] = await db
    .update(cakes)
    .set({ ...validated, updatedAt: new Date() })
    .where(eq(cakes.id, id))
    .returning();
  return updated || null;
};

export const deleteCake = async (id: string) => {
  const [deleted] = await db.delete(cakes).where(eq(cakes.id, id)).returning();
  return !!deleted;
};
