import * as attendanceRepository from "../repository/attendanceRepository.js";
import { getAttendanceStatus, isLatet } from "../utils/getAttendanceStatus.js";

export const getAttendanceByMonth = async (user, month, userName) => {
  const isPrivileged = user.role === "admin" || user.role === "hrd";

  if (isPrivileged) {
    return await attendanceRepository.findAttendanceByMonthAll(month, userName);
  } else {
    return await attendanceRepository.findAttendanceByMonthUser(month, user.user_id);
  }
};

export const processCheckIn = async (userId, now, today, isLateUtil) => {
  const existing = await attendanceRepository.findTodayAttendance(userId, today);

  if (existing) {
    throw new Error("Sudah check-in hari ini.");
  }

  const status = isLateUtil(now) ? "Late" : "Present";

  const attendance = await attendanceRepository.createAttendance({
    userId,
    checkIn: now,
    date: today,
    status,
  });
  return attendance;
};

export const processCheckOut = async (userId, today, getAttendanceStatusUtil) => {
  const attendance = await attendanceRepository.findTodayAttendance(userId, today);

  if (!attendance) {
    throw new Error("Belum check-in hari ini.");
  }

  const checkOutTime = new Date();
  const newStatus = getAttendanceStatusUtil(new Date(attendance.checkIn), checkOutTime);

  const updated = await attendanceRepository.updateAttendance(attendance.attendance_id, {
    checkOut: checkOutTime,
    status: newStatus,
  });
  return updated;
};

export const submitLeaveRequest = async (data) => {
  return attendanceRepository.createLeaveRequest(data);
};

// export const getRecapAttendance = async (userId, month, username) => {
//   const role = userId.role == "hrd" || userId.role == "admin"
//   if (role) {
//       return await attendanceRepository.findAttendanceByMonthAll(month, username);
//   } else {
//     return await attendanceRepository.findRecapAttendance(userId, month);
//   }
// };

export const getRecapAttendance = async (userId, month) => {
  try {
    const rawAttendances = await attendanceRepository.findRecapAttendance(userId, month);

    let fullDayCount = 0;
    let halfDayCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    const [year, monthNum] = month.split("-").map(Number);
    const daysInMonth = new Date(year, monthNum, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, monthNum - 1, day);
      currentDate.setHours(0, 0, 0, 0);

      // Skip weekend (Minggu = 0, Sabtu = 6)
      if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
        continue;
      }

      // Skip tanggal yang belum terjadi
      if (currentDate > today) {
        continue;
      }

      // Cari record kehadiran untuk tanggal ini
      const attendanceRecord = rawAttendances.find((att) => {
        const attDate = new Date(att.date);
        attDate.setHours(0, 0, 0, 0);
        return attDate.getTime() === currentDate.getTime();
      });

      if (attendanceRecord) {
        const checkInTime = attendanceRecord.checkIn ? new Date(attendanceRecord.checkIn) : null;
        const checkOutTime = attendanceRecord.checkOut ? new Date(attendanceRecord.checkOut) : null;

        const status = getAttendanceStatus(checkInTime, checkOutTime);
        
        if (status.includes("Full Day")) {
          fullDayCount++;
        } else if (status.includes("Half Day")) {
          halfDayCount++;
        }

        if (checkInTime && isLatet(checkInTime)) {
          lateCount++;
        }

        console.log(`Tanggal ${currentDate.toISOString().split('T')[0]}, Status: ${status}`);
      } else {
        absentCount++;
      }
    }

    return {
      fullDay: fullDayCount,
      halfDay: halfDayCount,
      late: lateCount,
      absent: absentCount,
      data: rawAttendances,
    };
  } catch (error) {
    console.error("Error in attendanceService.getRecapAttendance:", error);
    throw error;
  }
};

export const getAllLeaves = async (user) => {
  const isAdmin = user.role === "admin" || user.role === "hrd";
  return attendanceRepository.findAllLeaveRequests(isAdmin, user.user_id);
};

export const approveLeave = async (leaveId, status, user) => {
  if (user.role !== "admin" && user.role !== "hrd") {
    throw new Error("Akses hanya untuk admin atau HRD.");
  }

  if (!["Approved", "Rejected"].includes(status)) {
    throw new Error("Status harus Approved atau Rejected.");
  }

  return attendanceRepository.updateLeaveStatus(leaveId, status);
};

export const getLeavesByUser = async (userId, currentUser) => {
  if (currentUser.user_id !== userId && currentUser.role !== "admin" && currentUser.role !== "hrd") {
    throw new Error("Akses ditolak.");
  }
  return attendanceRepository.findLeavesByUserId(userId);
};
