import { create } from "zustand";
import { getRecentActivities } from "../../services/attendanceServices";
import { toYMDDate } from "../../utils/dateFormatter.js";

export const useActivityStore = create((set) => ({
    activities: [],
    fetchActivities: async () => {
        try {
            const { attendances, leaves, worklogs } = await getRecentActivities();
            const activityData = [];

            attendances.forEach((a) => {
                if (a.checkIn) {
                    activityData.push({
                        type: "attendance",
                        username: a.user.username,
                        message: `Check-in pada ${new Date(a.checkIn).toLocaleTimeString("id-ID")}`,
                        timestamp: a.checkIn,
                    });
                }
                if (a.checkOut) {
                    activityData.push({
                        type: "attendance",
                        username: a.user.username,
                        message: `Check-out pada ${new Date(a.checkOut).toLocaleTimeString("id-ID")}`,
                        timestamp: a.checkOut,
                    });
                }
            });

            leaves.forEach((l) => {
                activityData.push({
                    type: "leave",
                    username: l.user.username,
                    message: `Mengajukan cuti dari ${toYMDDate(l.startDate)} sampai ${toYMDDate(l.endDate)}`,
                    timestamp: l.submittedAt,
                });
            });

            worklogs.forEach((w) => {
                activityData.push({
                    type: "worklog",
                    username: w.user.username,
                    message: `Log kerja: ${w.title}`,
                    timestamp: w.date,
                });
            });

            activityData.sort(
                (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );

            set({ activities: activityData });
        } catch (err) {
            console.error("Gagal memuat aktivitas:", err);
            set({ activities: [] });
        }
    },
}));
