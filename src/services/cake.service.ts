import { db } from '../db';
import { cakes } from '../db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const cakeSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/), // string for numeric precision
  category: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const getAllCakes = async () => {
  return db.select().from(cakes).execute();
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
