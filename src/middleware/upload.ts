import multer from 'multer';
import { Request } from 'express';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req: Request, file, cb: multer.FileFilterCallback) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, WebP allowed') as Error, false);
    }
  },
});

export const uploadSingleImage = upload.single('image');
export const uploadSingleAvatar = upload.single('avatar');
