import { Router } from 'express';
import * as controller from '../controllers/cake.controller';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', uploadSingleImage, controller.create);
router.patch('/:id', uploadSingleImage, controller.update);
router.delete('/:id', controller.remove);

export default router;
