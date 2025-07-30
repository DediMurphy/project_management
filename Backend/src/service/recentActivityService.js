import {
    getRecentAttendances,
    getRecentLeaves,
    getRecentWorklogs,
    getRecentTasks,
} from "../repository/recentActivityRepository.js";

export const getRecentActivities = async (userId) => {
    const [attendances, leaves, worklogs, tasks] = await Promise.all([
        getRecentAttendances(userId),
        getRecentLeaves(userId),
        getRecentWorklogs(userId),
        getRecentTasks(userId),
    ]);

    return { attendances, leaves, worklogs, tasks };
};
