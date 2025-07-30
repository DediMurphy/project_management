import express from "express";
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from "../controller/taskController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

const router = express.Router();

router.post('/', authMiddleware, authorizeRoles("admin"), createTask);
router.get("/", authMiddleware, getAllTasks);
router.get("/:id", authMiddleware, getTaskById);
router.put('/:id',authMiddleware, updateTask);
router.delete('/:id',authMiddleware, deleteTask);

export default router;