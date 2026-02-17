import crypto from 'crypto';
import { Readable } from 'stream';
import cloudinary from '../utils/cloudinary';
import { db } from '../db';
import { uploadedAssets } from '../db/schema';
import { eq } from 'drizzle-orm';

const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const hashBuffer = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

export const uploadImage = async (
  file: Express.Multer.File,
  folder: string = 'cakesbysparrow',
): Promise<{ url: string; publicId: string; duplicate: boolean }> => {
  const hash = hashBuffer(file.buffer);

  // check DB first before hitting Cloudinary
  try {
    const existing = await db
      .select({ url: uploadedAssets.url, publicId: uploadedAssets.publicId })
      .from(uploadedAssets)
      .where(eq(uploadedAssets.hash, hash))
      .limit(1);

    if (existing[0]) {
      return { ...existing[0], duplicate: true };
    }
  } catch (err) {
    // log but don't block the upload if the DB check fails
    console.error('Hash lookup failed:', err);
  }

  // not seen before, upload to Cloudinary
  const publicId = `${folder}/${hash}`;

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'image',
          overwrite: false,
          unique_filename: false,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('No result from Cloudinary'));
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        },
      );

      bufferToStream(file.buffer).pipe(uploadStream);
    },
  );

  // persist hash, don't block response on failure
  db.insert(uploadedAssets)
    .values({ hash, url: result.secure_url, publicId: result.public_id })
    .catch((err) => console.error('Failed to persist upload hash:', err));

  return {
    url: result.secure_url,
    publicId: result.public_id,
    duplicate: false,
  };
};
