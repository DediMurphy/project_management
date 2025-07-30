import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {getRecentActivitiesById} from "../controller/recentActivityController.js";

const router = express.Router();

router.get("/activities/recent", authMiddleware, getRecentActivitiesById);

export default router