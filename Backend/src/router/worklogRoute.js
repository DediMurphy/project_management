import express from "express";
import { createWorkLog, deleteWorkLog, getAllWorkLog, getLogById, updateWorklog } from "../controller/workLogController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, getAllWorkLog);
router.get('/:id',authMiddleware, getLogById)
router.post('/', authMiddleware, createWorkLog);
router.put('/:id' , authMiddleware, updateWorklog);
router.delete('/:id', authMiddleware, deleteWorkLog);

export default router;