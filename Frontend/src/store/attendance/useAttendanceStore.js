import { create } from "zustand";
import { getAllAttendance } from "../../services/attendanceServices";

export const useAttendanceStore = create((set) => ({
    attendances: [],
    loading: false,
    error: null,

    fetchAttendances: async (month, username) => {
        set({ loading: true, error: null });
        try {
            const data = await getAllAttendance(month, username);
            set({ attendances: data, loading: false });
        } catch (err) {
            console.error("Fetch attendances error:", err);
            set({ error: "Gagal memuat data absensi", loading: false });
        }
    },

}));
