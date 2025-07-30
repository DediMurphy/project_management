import prisma from "../db/index.js";

export const getMonthRange = (month) => {
  if (!month || typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
    throw new Error("Invalid month format. Expected YYYY-MM.");
  }
  const start = new Date(`${month}-01T00:00:00.000Z`);
  const end = new Date(start);
  end.setUTCMonth(end.getUTCMonth() + 1); // Gunakan setUTCMonth untuk menghindari masalah zona waktu
  return { start, end };
};

export const findProjectById = async (projectId) => {
    return prisma.project.findUnique({
        where: {
            project_id: projectId,
        },
    });
};

export const getAttendanceByMonthAll = async (month) => {
  const { start, end } = getMonthRange(month);

  return prisma.attendance.findMany({
    where: {
      date: {
        gte: start,
        lt: end,
      },
    },
    orderBy: { date: "desc" },
    include: { user: true },
  });
};

export const findAttendanceByMonthAll = async (month, userName) => {
  const { start, end } = getMonthRange(month);

  const whereClause = {
    date: {
      gte: start,
      lt: end,
    },
  };

  if (userName) {
    whereClause.user = {
      name: {
        contains: userName,
        mode: "insensitive", 
      },
    };
  }

  return prisma.attendance.findMany({
    where: whereClause,
    orderBy: { date: "desc" },
    include: { user: true },
  });
};

export const getAttendanceByMonthUser = async (month, userId) => {
  const { start, end } = getMonthRange(month);

  return prisma.attendance.findMany({
    where: {
      userId,
      date: {
        gte: start,
        lt: end,
      },
    },
    orderBy: { date: "desc" },
    include: { user: true },
  });
};

export const findAttendanceByMonthUser = async (month, userId) => {
  const { start, end } = getMonthRange(month);

  return prisma.attendance.findMany({
    where: {
      userId,
      date: {
        gte: start,
        lt: end,
      },
    },
    orderBy: { date: "desc" },
    include: { user: true },
  });
};

export const findRecentAttendances = () => {
  return prisma.attendance.findMany({
    include: { user: true },
    orderBy: { checkIn: "desc" },
    take: 10,
  });
};

export const findRecentLeaves = () => {
  return prisma.leave_request.findMany({
    include: { user: true },
    orderBy: { submittedAt: "desc" },
    take: 10,
  });
};

export const findAllLeaveRequests = (isAdmin, userId) => {
  if (isAdmin) {
    return prisma.leave_request.findMany({
      include: { user: true },
      orderBy: { submittedAt: "desc" },
    });
  } else {
    return prisma.leave_request.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { submittedAt: "desc" },
    });
  }
};

export const findRecentWorklogs = () => {
  return prisma.work_log.findMany({
    include: { user: true },
    orderBy: { startTime: "desc" },
    take: 10,
  });
};

export const findTodayAttendance = (userId, today) => {
  // Pastikan `today` adalah awal hari dalam UTC untuk perbandingan yang akurat
  const startOfDay = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const endOfDay = new Date(startOfDay);
  endOfDay.setUTCDate(startOfDay.getUTCDate() + 1);

  return prisma.attendance.findFirst({
    where: {
      userId,
      date: {
        gte: startOfDay,
        lt: endOfDay,
      },
    },
  });
};

export const createAttendance = (data) => {
  return prisma.attendance.create({ data });
};

export const updateAttendance = (id, data) => {
  return prisma.attendance.update({
    where: { attendance_id: id },
    data,
  });
};

export const createLeaveRequest = (data) => {
  return prisma.leave_request.create({ data });
};

export const getAllLeaveRequests = (isAdmin, userId) => {
  if (isAdmin) {
    return prisma.leave_request.findMany({
      include: { user: true },
      orderBy: { submittedAt: "desc" },
    });
  } else {
    return prisma.leave_request.findMany({
      where: { userId },
      include: { user: true },
      orderBy: { submittedAt: "desc" },
    });
  }
};

export const updateLeaveStatus = (leaveId, status) => {
  return prisma.leave_request.update({
    where: { leave_id: leaveId },
    data: { status },
  });
};

export const findLeavesByUserId = (userId) => {
  return prisma.leave_request.findMany({
    where: { userId },
    include: { user: true },
    orderBy: { submittedAt: "desc" },
  });
};

export const findRecapAttendance = async (userId, month) => {
  const { start, end } = getMonthRange(month);

  return prisma.attendance.findMany({
    where: {
      userId,
      date: { gte: start, lt: end },
    },    
    include: {
      user: {
        select :{ 
          username: true
        }
      }
    },
    orderBy: { date: "asc" },
  });
};
