import express from 'express';
import {
  register,
  login,
  refreshAccessToken,
  logout
} from '../controller/authController.js';

import authMiddleware from '../middlewares/authMiddleware.js';
import { authorizeRoles } from '../middlewares/authorizeRoles.js';
import sendResponse from '../middlewares/responseFormatter.js';


const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/refresh-token', refreshAccessToken);
router.post('/logout', logout);

router.get('/user', authMiddleware, (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    message: 'Authenticated route',
    data: req.user
  });
});

router.get('/admin', authMiddleware, authorizeRoles('admin'), (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    message: 'Welcome, Admin!',
    data: req.user
  });
});

router.get('/hrd', authMiddleware, authorizeRoles('hrd'), (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    message: 'Welcome, Manager!',
    data: req.user
  });
});

// ✅ Role-Based Route: Admin or Manager
router.get('/admin-or-manager', authMiddleware, authorizeRoles('admin', 'manager'), (req, res) => {
  sendResponse(res, {
    statusCode: 200,
    message: 'Hello Admin or Manager!',
    data: req.user
  });
});

export default router;
