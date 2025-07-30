import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";
import {
  createUserByAdmin,
  getUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "../controller/adminUserController.js";

const router = express.Router();

// Protect all route with admin
router.use(authMiddleware, authorizeRoles("Admin"));

router.post("/users", createUserByAdmin);
router.get("/users", getUsers);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);

export default router;
