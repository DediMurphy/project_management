import express from 'express';
import * as projectController from '../controller/projectController.js';
const router = express.Router();

router.post('/', projectController.create);
router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.remove);

export default router;