import { db } from '../db';
import { cakes } from '../db/schema';
import { eq, count } from 'drizzle-orm';
import { z } from 'zod';
import cloudinary from '../utils/cloudinary';

const cakeSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/), // string for numeric precision
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

  let imageUrl: string | undefined;

  if (file) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cakesbysparrow/cakes',
            resource_type: 'image',
            allowed_formats: ['jpg', 'png', 'webp'],
          },
          (error, result) => (error ? reject(error) : resolve(result)),
        );
        uploadStream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    } catch (err: any) {
      throw new Error(`Cloudinary upload failed: ${err.message}`);
    }
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

  let imageUrl: string | undefined;

  if (file) {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'cakesbysparrow/cakes',
            resource_type: 'image',
            allowed_formats: ['jpg', 'png', 'webp'],
          },
          (error, result) => (error ? reject(error) : resolve(result)),
        );
        uploadStream.end(file.buffer);
      });
      imageUrl = result.secure_url;
    } catch (err: any) {
      throw new Error(`Cloudinary upload failed: ${err.message}`);
    }
  }

  const updateData: any = { ...validated, updatedAt: new Date() };
  if (imageUrl) updateData.imageUrl = imageUrl;

  const [updated] = await db
    .update(cakes)
    .set(updateData)
    .where(eq(cakes.id, id))
    .returning();

  if (!updated) throw new Error('Cake not found');

  return updated;
};

export const deleteCake = async (id: string) => {
  const [cake] = await db.select().from(cakes).where(eq(cakes.id, id)).limit(1);

  if (!cake) throw new Error('Cake not found');

  if (cake.imageUrl) {
    const publicId = cake.imageUrl.split('/').pop()?.split('.')[0];
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(`cakesbysparrow/cakes/${publicId}`);
      } catch (err: any) {
        console.error('Cloudinary delete failed:', err.message);
        // continue deletion even if image delete fails
      }
    }
  }

  const [deleted] = await db.delete(cakes).where(eq(cakes.id, id)).returning();

  return !!deleted;
};
