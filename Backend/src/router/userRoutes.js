import express from "express";
import { getAllUsers } from "../controller/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const router = express.Router();

router.get("/",authMiddleware, getAllUsers);

export default router;
