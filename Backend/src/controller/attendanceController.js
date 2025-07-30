import sendResponse from "../middlewares/responseFormatter.js";
import { getAttendanceStatus } from "../utils/getAttendanceStatus.js";
import { isLate } from "../utils/isLate.js";
import prisma from "../db/index.js";
import * as attendanceService from "../service/attendanceService.js";


export const getAllAttendance = async (req, res, next) => {
  try {
    const { month, username } = req.query; 

    if (!month) {
      return sendResponse(res, {
        statusCode: 400,
        message: "Parameter 'month' is required and must be in YYYY-MM format.",
      });
    }
    const attendances = await attendanceService.getAttendanceByMonth(req.user, month, username); 
    sendResponse(res, {
      statusCode: 200,
      message: `Attendance${month ? ` for ${month}` : ""}${username ? ` for user ${username}` : ""} retrieved successfully`, // MODIFIED: Updated message
      data: attendances,
    });
  } catch (error) {
    if (error.message.includes("Invalid month format")) {
      return sendResponse(res, {
        statusCode: 400,
        message: error.message,
      });
    }
    next(error);
  }
};


export const getRecentActivities = async (req, res, next) => {
  try {
    const recentAttendances = await prisma.attendance.findMany({
      include: { user: true },
      orderBy: { checkIn: "desc" },
      take: 10,
    });

    const recentLeaves = await prisma.leave_request.findMany({
      include: { user: true },
      orderBy: { submittedAt: "desc" },
      take: 10,
    });

    const recentWorklogs = await prisma.work_log.findMany({
      include: { user: true },
      orderBy: { startTime: "desc" },
      take: 10,
    });

    res.status(200).json({
      message: "Recent activities retrieved successfully",
      data: {
        attendances: recentAttendances,
        leaves: recentLeaves,
        worklogs: recentWorklogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const checkIn = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const attendance = await attendanceService.processCheckIn(userId, now, today, isLate);

    sendResponse(res, {
      statusCode: 200,
      message: "Check-in berhasil",
      data: attendance,
    });
  } catch (error) {
    if (error.message === "Sudah check-in hari ini.") {
      return sendResponse(res, {
        statusCode: 400,
        message: error.message,
      });
    }
    next(error);
  }
};


export const checkOut = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const updatedAttendance = await attendanceService.processCheckOut(userId, today, getAttendanceStatus);

    sendResponse(res, {
      statusCode: 200,
      message: "Check-out berhasil",
      data: updatedAttendance,
    });
  } catch (error) {
    if (error.message === "Belum check-in hari ini.") {
      return sendResponse(res, {
        statusCode: 404,
        message: error.message,
      });
    }
    next(error);
  }
};

export const requestLeave = async (req, res, next) => {
  try {
    const { type, startDate, endDate, reason, status } = req.body;
    const userId = req.user.user_id;

    const leaveData = {
      userId,
      type,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      reason,
      status: status || "Pending",
    };

    const leave = await attendanceService.submitLeaveRequest(leaveData);

    sendResponse(res, {
      statusCode: 201,
      message: "Pengajuan cuti berhasil dikirim",
      data: leave,
    });
  } catch (err) {
    next(err);
  }
};

export const recapAttendance = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const { month } = req.query;

    const start = new Date(`${month}-01T00:00:00Z`);
    const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

    const data = await prisma.attendance.findMany({
      where: {
        userId,
        date: { gte: start, lt: end },
      },
      orderBy: { date: "asc" },
    });

    const total = data.length;
    const fullDay = data.filter((a) => a.status?.includes("Full Day")).length;
    const halfDay = data.filter((a) => a.status?.includes("Half Day")).length;
    const late = data.filter((a) => a.status === "Late" || a.status?.includes("Late")).length;
    const absent = data.filter((a) => a.status === "Absent").length;

    res.status(200).json({
      total,
      fullDay,
      halfDay,
      late,
      absent,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const recapAttendanceAll = async (req, res, next) => {
  try {
    const { month } = req.query;

    const start = new Date(`${month}-01T00:00:00Z`);
    const end = new Date(new Date(start).setMonth(start.getMonth() + 1));

    const data = await prisma.attendance.findMany({
      where: {
        date: { gte: start, lt: end },
      },
      orderBy: { date: "asc" },
    });

    const total = data.length;
    const fullDay = data.filter((a) => a.status?.includes("Full Day")).length;
    const halfDay = data.filter((a) => a.status?.includes("Half Day")).length;
    const late = data.filter((a) => a.status === "Late" || a.status?.includes("Late")).length;
    const absent = data.filter((a) => a.status === "Absent").length;

    res.status(200).json({
      total,
      fullDay,
      halfDay,
      late,
      absent,
      data,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllLeaves = async (req, res, next) => {
  try {
    const leaves = await attendanceService.getAllLeaves(req.user);

    sendResponse(res, {
      statusCode: 200,
      message: "Daftar pengajuan cuti berhasil diambil",
      data: leaves,
    });
  } catch (error) {
    next(error);
  }
};

export const approveLeave = async (req, res, next) => {
  try {
    const leaveId = parseInt(req.params.leaveId);
    const { status } = req.body; 

    const updatedLeave = await attendanceService.approveLeave(leaveId, status, req.user);

    sendResponse(res, {
      statusCode: 200,
      message: `Pengajuan cuti telah di-${status === "Approved" ? "setujui" : "tolak"}`,
      data: updatedLeave,
    });
  } catch (error) {
    if (error.message === "Akses hanya untuk admin atau HRD." || error.message === "Status harus Approved atau Rejected.") {
      return sendResponse(res, {
        statusCode: 403, 
        message: error.message,
      });
    }
    next(error);
  }
};

export const getLeavesByUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);

    const leaves = await attendanceService.getLeavesByUser(userId, req.user);

    sendResponse(res, {
      statusCode: 200,
      message: "Daftar pengajuan cuti",
      data: leaves,
    });
  } catch (error) {
    if (error.message === "Akses ditolak.") {
      return sendResponse(res, {
        statusCode: 403,
        message: error.message,
      });
    }
    next(error);
  }
};