import { db } from '../db';
import { cakes } from '../db/schema';
import { eq, count } from 'drizzle-orm';
import { z } from 'zod';
import cloudinary from '../utils/cloudinary';
import { uploadImage } from './upload.service';

const cakeSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  category: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

export const getAllCakes = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  const data = await db.select().from(cakes).limit(limit).offset(offset);
  const total = await db.select({ count: count() }).from(cakes);
  return { data, total: total[0]?.count ?? 0, page, limit };
};

export const getCakeById = async (id: string) => {
  const result = await db.select().from(cakes).where(eq(cakes.id, id)).limit(1);
  return result[0] || null;
};

export const createCake = async (data: unknown, file?: Express.Multer.File) => {
  const validated = cakeSchema.parse(data);

  let imageUrl = validated.imageUrl;

  if (file) {
    const { url } = await uploadImage(file, 'cakesbysparrow/cakes');
    imageUrl = url;
  }

  const [newCake] = await db
    .insert(cakes)
    .values({ ...validated, imageUrl })
    .returning();

  return newCake;
};

export const updateCake = async (
  id: string,
  data: unknown,
  file?: Express.Multer.File,
) => {
  const validated = cakeSchema.partial().parse(data);

  let imageUrl = validated.imageUrl;

  if (file) {
    const { url } = await uploadImage(file, 'cakesbysparrow/cakes');
    imageUrl = url;
  }

  const [updated] = await db
    .update(cakes)
    .set({ ...validated, ...(imageUrl && { imageUrl }), updatedAt: new Date() })
    .where(eq(cakes.id, id))
    .returning();

  if (!updated) throw new Error('Cake not found');

  return updated;
};

export const deleteCake = async (id: string) => {
  const [cake] = await db.select().from(cakes).where(eq(cakes.id, id)).limit(1);

  if (!cake) throw new Error('Cake not found');

  if (cake.imageUrl) {
    // extract public_id from full Cloudinary URL correctly
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v<version>/<public_id>.<ext>
    const urlParts = cake.imageUrl.split('/upload/');
    if (urlParts[1]) {
      const publicId = urlParts[1]
        .replace(/^v\d+\//, '') // strip version prefix e.g. v1234567890/
        .replace(/\.[^.]+$/, ''); // strip file extension

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error(
          'Cloudinary delete failed:',
          err instanceof Error ? err.message : err,
        );
      }
    }
  }

  const [deleted] = await db.delete(cakes).where(eq(cakes.id, id)).returning();

  return !!deleted;
};
