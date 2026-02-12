import { Router } from 'express';
import * as controller from '../controllers/cake.controller';

const router = Router();

router.get('/', controller.getAllCakes);
router.get('/:id', controller.getCakeById);
router.post('/', controller.createCake);

export default router;
