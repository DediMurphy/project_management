import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/authorizeRoles.js";

import {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} from "../controller/roleController.js";

const router = express.Router();

// router.use(authMiddleware, authorizeRoles("admin"));

router.post("/", createRole);
router.get("/", getRoles);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);

export default router;
