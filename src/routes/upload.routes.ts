import { Router } from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // or diskStorage if needed

router.post('/image', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });

    const result = await cloudinary.uploader.upload_stream(
      { folder: 'cakesbysparrow', resource_type: 'image' },
      (error, result) => {
        if (error) throw error;
        res.json({
          url: result?.secure_url,
          public_id: result?.public_id,
        });
      },
    );

    req.file.stream.pipe(result);
  } catch (err) {
    next(err);
  }
});

export default router;
