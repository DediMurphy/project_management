import { create } from "zustand";
import { getAttendanceRecap, getAttendAll } from "../../services/attendanceServices.jsx";

export const useRecapStore = create((set) => ({
    recap: null,
    error: null,

    fetchRecap: async (userId, month) => {
        try {
            const recap = await getAttendanceRecap(userId, month);
            set({
                recap: {
                    fullDay: recap.fullDay ?? 0,
                    halfDay: recap.halfDay ?? 0,
                    late: recap.late ?? 0,
                    absent: recap.absent ?? 0,
                    data: recap.data || [],
                },
            });
        } catch (err) {
            console.error("[RecapStore] Gagal mengambil rekap:", err);
            set({ error: "Gagal mengambil rekap absensi" });
        }
    },

    fetchRecapAll: async (month) => {
        try {
            console.log("🔍 Fetching recap for month:", month);
            const recap = await getAttendAll(month);
            console.log("📊 API Response:", recap);
            set({
                recap: {
                    fullDay: recap.fullDay ?? 0,
                    halfDay: recap.halfDay ?? 0,
                    late: recap.late ?? 0,
                    absent: recap.absent ?? 0,
                    data: recap.data || [],
                },
            });
            console.log("✅ State updated successfully");
        } catch (err) {
            console.error("[RecapStore] Gagal mengambil rekap:", err);
            set({ error: "Gagal mengambil rekap absensi" });
        }
    },
}));
