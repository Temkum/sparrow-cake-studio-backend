import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import cloudinary from '../utils/cloudinary';
import { uploadSingleImage } from '../middleware/upload';
import { Readable } from 'stream';
import { db } from '../db';
import { uploadedAssets } from '../db/schema';
import { eq } from 'drizzle-orm';

const router = Router();

const bufferToStream = (buffer: Buffer): Readable => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
};

const hashBuffer = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

router.post(
  '/image',
  uploadSingleImage,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file provided' });
      }

      const hash = hashBuffer(req.file.buffer);

      // check DB first, never hit Cloudinary if we already have it
      const existing = await db
        .select()
        .from(uploadedAssets)
        .where(eq(uploadedAssets.hash, hash))
        .limit(1);

      if (existing[0]) {
        return res.status(200).json({
          url: existing[0].url,
          public_id: existing[0].publicId,
          duplicate: true,
        });
      }

      // not seen before, upload to Cloudinary
      const publicId = `cakesbysparrow/${hash}`;

      const result = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
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

        bufferToStream(req.file!.buffer).pipe(uploadStream);
      });

      // persist hash so next upload of same file is caught immediately
      await db.insert(uploadedAssets).values({
        hash,
        url: result.secure_url,
        publicId: result.public_id,
      });

      return res.status(201).json({
        url: result.secure_url,
        public_id: result.public_id,
        duplicate: false,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
