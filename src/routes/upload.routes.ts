import { Router, Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import cloudinary from '../utils/cloudinary';
import { uploadSingleImage } from '../middleware/upload';
import { Readable } from 'stream';

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
      const publicId = `cakesbysparrow/${hash}`;

      const result = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: undefined, // folder is baked into publicId
            public_id: publicId,
            resource_type: 'image',
            overwrite: false, // skip upload if already exists
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

      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
