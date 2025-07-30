import { createLog, deleteLog, findAllLog, findLogByUser, updateLog, getWorklogByDate, getWorklogByDateAndUser } from "../repository/worklogRepository.js";
import { toYMD } from "../utils/fromaterDate.js";

export const getAllWorkLog = async (user) => {
  let logs;
  if (user.role === "admin") {
    logs = await findAllLog();
  } else {
    logs = await findLogByUser(user.user_id);
  }

  return logs.map((log) => ({
    ...log,
    date: toYMD(log.date),
    username: log.user?.username || null,
    role: log.user?.role || null,
  }));
};

export const addWorkLog = async (logData) => {
  const dataLog = {
    ...logData,
    date: new Date(logData.date),
  };
  return await createLog(dataLog);
};

export const editWorkLog = async (logId, logData) => {
  
  const fixedLogData = {
    ...logData,
    date: new Date(logData.date),
  };
  return await updateLog(logId, fixedLogData);
};

export const removeWorkLog = async (logId) => {
  const worklog = await deleteLog(logId);
  if (!worklog) {
    throw new Error("Worklog not found");
  }
  return worklog;
};

export const getWorkByDate = async (date, user) => {
  let logs;
  if (user.role === "admin") {
    logs = await getWorklogByDate(date);
  } else {
    logs = await getWorklogByDateAndUser(date, user.user_id);
  }
  return logs.map((log) => ({
    ...log,
    date: toYMD(log.date),
    username: log.user?.username || null,
    role: log.user?.role || null,
  }));
};
