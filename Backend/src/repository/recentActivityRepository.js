import prisma from "../db/index.js";

export const getRecentAttendances = async (userId) => {
    return prisma.attendance.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { date: "desc" },
        take: 10,
    });
};

export const getRecentLeaves = async (userId) => {
    return prisma.leave_request.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { submittedAt: "desc" },
        take: 10,
    });
};

export const getRecentWorklogs = async (userId) => {
    return prisma.work_log.findMany({
        where: { userId },
        include: { user: true },
        orderBy: { date: "desc" },
        take: 10,
    });
};

export const getRecentTasks = async (userId) => {
    return prisma.task.findMany({
        where: { createdById: userId },
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 10,
    });
};
