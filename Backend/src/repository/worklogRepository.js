import prisma from "../db/index.js";
import { toYMD } from "../utils/fromaterDate.js";

export const findAllLog = async () => {
  return prisma.work_log.findMany({
    include: {
      user: {
        select: {
          username: true,
          role: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  });
};

export const findLogByUser = async (userId) => {
    return prisma.work_log.findMany({
    where: { userId },
    include: {
      user: { select: { username: true, role: true } },
    },
  });
};

export const createLog = async (newLog) => {
  console.log("API creatework_log dapat:", newLog);
  return prisma.work_log.create({
    data: {
      title: newLog.title,
      description: newLog.description,
      startTime: newLog.startTime,
      endTime: newLog.endTime,
      status: newLog.status,
      date: newLog.date,
      comment: newLog.comment,
      userId: newLog.userId,
    },
  });
};

export const updateLog = async (logId, updateLog) => {
  return prisma.work_log.update({
    where: {
      work_log_id: logId,
    },
    data: {
      title: updateLog.title,
      description: updateLog.description,
      startTime: updateLog.startTime,
      endTime: updateLog.endTime,
      status: updateLog.status,
      date: updateLog.date,
      comment: updateLog.comment,
    },
  });
};

export const deleteLog = async (logId) => {
  return prisma.work_log.delete({
    where: {
      work_log_id: logId,
    },
  });
};

export const getWorklogByDate = async (date) => {
  const parsedDate = new Date(date);

  const nextDay = new Date(parsedDate);
  nextDay.setDate(parsedDate.getDate() + 1);

  return prisma.work_log.findMany({
    where: {
      date: {
        gte: parsedDate,
        lt: nextDay,
      },
    },
    include: {
      user: {
        select: {
          username: true,
          role: true,
        },
      },
    },
    orderBy: { startTime: "asc" },
  });
};


export const getWorklogByDateAndUser = async (date, userId) => {
  return prisma.work_log.findMany({
    where: {
      date: new Date(date),
      userId,
    },
    include: {
      user: { select: { username: true, role: true } },
    },
  });
};
