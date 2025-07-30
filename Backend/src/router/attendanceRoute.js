import express from 'express';
import {
    checkIn,
    checkOut,
    requestLeave,
    recapAttendance,
    getAllAttendance,
    getAllLeaves,
    approveLeave,
    getLeavesByUser, getRecentActivities,
    recapAttendanceAll
} from '../controller/attendanceController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, getAllAttendance)
router.get("/recent-activities",authMiddleware, getRecentActivities);
router.post('/check-in', authMiddleware, checkIn,) ; 
router.post('/check-out', authMiddleware, checkOut);
router.post('/leave', authMiddleware, requestLeave);
router.get('/recap/:userId', authMiddleware, recapAttendance);
router.get('/recap/', authMiddleware, recapAttendanceAll)
router.get('/approval', authMiddleware, getAllLeaves);
router.patch('/:leaveId/approve', authMiddleware, approveLeave);
router.get("/leaves/:userId", authMiddleware, getLeavesByUser);

export default router;
