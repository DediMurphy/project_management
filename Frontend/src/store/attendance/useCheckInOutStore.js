import { create } from "zustand";
import { checkInAttendance, checkOutAttendance } from "../../services/attendanceServices.jsx";

export const useCheckInOutStore = create((set) => ({
    error: null,

    checkIn: async () => {
        try {
            await checkInAttendance();
            set({ error: null });
        } catch {
            set({ error: "Gagal check-in" });
        }
    },

    checkOut: async () => {
        try {
            await checkOutAttendance();
            set({ error: null });
        } catch {
            set({ error: "Gagal check-out" });
        }
    }
}));
